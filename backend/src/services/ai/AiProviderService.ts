import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import retry from 'async-retry';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { redis } from '../../config/redis';

export class AiProviderService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.OPENROUTER_API_KEY) {
      this.openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: config.OPENROUTER_API_KEY
      });
    }

    if (config.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    }
  }

  private generateCacheKey(prompt: string): string {
    return 'ai_cache:' + crypto.createHash('sha256').update(prompt).digest('hex');
  }

  async generateText(prompt: string, bypassCache = false): Promise<string> {
    const cacheKey = this.generateCacheKey(prompt);

    if (!bypassCache && redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug('AI Cache Hit', { cacheKey });
        return cached;
      }
    }

    const response = await this.executeWithFallback(prompt);

    if (redis && response) {
      // Cache for 24 hours
      await redis.setex(cacheKey, 86400, response);
    }

    return response;
  }

  private async executeWithFallback(prompt: string): Promise<string> {
    return retry(
      async (bail) => {
        try {
          if (this.openai) {
            logger.debug('Attempting generation with OpenRouter');
            const completion = await this.openai.chat.completions.create({
              model: 'anthropic/claude-3-haiku', // Default fast model
              messages: [{ role: 'user', content: prompt }]
            });
            return completion.choices[0]?.message?.content || '';
          } else {
            throw new Error('OpenRouter not configured');
          }
        } catch (error: any) {
          logger.warn('OpenRouter failed, falling back to Gemini', { error: error.message });
          
          if (this.gemini) {
            const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            return result.response.text();
          }
          
          // If gemini fails or isn't configured, we throw error so async-retry can catch it.
          throw new Error('All AI providers failed');
        }
      },
      {
        retries: 2,
        onRetry: (error: any, attempt: number) => {
          logger.warn(`AI Provider retry attempt ${attempt}`, { error: error.message });
        }
      }
    );
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // OpenRouter / OpenAI embeddings
    if (this.openai) {
      // Actually OpenRouter doesn't strictly have a dedicated embedding endpoint easily accessible without a specific model routing. 
      // Assuming standard OpenAI embeddings proxy if configured:
      try {
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: text
        });
        return response.data[0].embedding;
      } catch (err: any) {
         logger.warn('OpenRouter Embeddings failed', { err: err.message });
      }
    }

    // Fallback to Gemini Embeddings
    if (this.gemini) {
      try {
        const model = this.gemini.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
      } catch (err: any) {
         logger.warn('Gemini Embeddings failed', { err: err.message });
      }
    }

    throw new Error('All Embedding providers failed or none configured');
  }
}

export const aiProvider = new AiProviderService();

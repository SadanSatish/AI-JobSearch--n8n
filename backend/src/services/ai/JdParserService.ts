import { aiProvider } from './AiProviderService';
import { promptManager } from './PromptManager';
import { logger } from '../../config/logger';

export class JdParserService {
  /**
   * Parses raw job description text into a structured JSON payload
   */
  async parseStructured(rawText: string): Promise<any> {
    try {
      const prompt = promptManager.buildPrompt('parse_jd', { jd_text: rawText });
      const outputText = await aiProvider.generateText(prompt);
      
      const validatedJson = promptManager.validateOutput('parse_jd', outputText);
      return validatedJson;
    } catch (error: any) {
      logger.error('Failed to parse JD into structured JSON', { error: error.message });
      throw new Error('AI JD parsing failed');
    }
  }
}

export const jdParser = new JdParserService();

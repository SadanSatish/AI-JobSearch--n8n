import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../../config/env';
import { logger } from '../../config/logger';

export class QdrantService {
  private client: QdrantClient | null = null;
  private readonly collectionName = 'jobsearch_vectors';

  constructor() {
    if (config.QDRANT_URL && config.QDRANT_API_KEY) {
      this.client = new QdrantClient({
        url: config.QDRANT_URL,
        apiKey: config.QDRANT_API_KEY
      });
    } else {
      logger.warn('Qdrant config missing, vector search disabled');
    }
  }

  async initializeCollection(vectorSize: number = 1536) {
    if (!this.client) return;
    try {
      const exists = await this.client.collectionExists(this.collectionName);
      if (!exists.exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: vectorSize, // 1536 for OpenAI small, 768 for Gemini
            distance: 'Cosine'
          }
        });
        logger.info(`Qdrant collection ${this.collectionName} created.`);
      }
    } catch (error: any) {
      logger.error('Failed to init Qdrant collection', { error: error.message });
    }
  }

  async upsertVector(id: string, vector: number[], payload: Record<string, any>) {
    if (!this.client) throw new Error('Qdrant not configured');
    await this.client.upsert(this.collectionName, {
      wait: true,
      points: [
        {
          id,
          vector,
          payload
        }
      ]
    });
  }

  async searchSimilar(vector: number[], limit: number = 5, filter?: Record<string, any>) {
    if (!this.client) throw new Error('Qdrant not configured');
    
    const searchFilter = filter ? { must: [filter] } : undefined;

    const result = await this.client.search(this.collectionName, {
      vector,
      limit,
      filter: searchFilter,
      with_payload: true
    });
    
    return result;
  }
}

export const qdrantService = new QdrantService();

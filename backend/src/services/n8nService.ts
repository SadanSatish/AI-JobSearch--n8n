import { config } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../middlewares/errorHandler';

export class N8nService {
  /**
   * Proxies a webhook call securely to the internal n8n instance.
   * This isolates the n8n public endpoint from the external internet.
   */
  static async triggerWebhook(webhookId: string, payload: any): Promise<any> {
    const url = `${config.N8N_WEBHOOK_URL}/webhook/${webhookId}`;
    logger.debug(`Triggering n8n webhook: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new AppError(`n8n webhook failed with status: ${response.status}`, 502);
      }

      return await response.json();
    } catch (error: any) {
      logger.error('n8n Webhook Trigger Failed', { error: error.message });
      throw new AppError('Failed to communicate with workflow engine', 502);
    }
  }
}

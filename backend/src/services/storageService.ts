import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/env';
import { logger } from '../config/logger';

export class StorageService {
  private s3Client?: S3Client;

  constructor() {
    if (config.STORAGE_PROVIDER !== 'local') {
      this.s3Client = new S3Client({
        endpoint: config.S3_ENDPOINT,
        region: config.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: config.S3_ACCESS_KEY_ID || '',
          secretAccessKey: config.S3_SECRET_ACCESS_KEY || ''
        }
      });
    }
  }

  async uploadFile(key: string, data: Buffer | Uint8Array | string, contentType: string): Promise<string> {
    if (config.STORAGE_PROVIDER === 'local') {
      const localPath = path.join(__dirname, '../../uploads', key);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, data);
      logger.debug(`File uploaded locally at ${localPath}`);
      return `/uploads/${key}`;
    } else {
      if (!this.s3Client) throw new Error('S3 Client not initialized');
      const command = new PutObjectCommand({
        Bucket: config.S3_BUCKET,
        Key: key,
        Body: data,
        ContentType: contentType
      });
      await this.s3Client.send(command);
      logger.debug(`File uploaded to cloud storage at ${key}`);
      return `${config.S3_ENDPOINT}/${config.S3_BUCKET}/${key}`;
    }
  }
}

export const storageService = new StorageService();

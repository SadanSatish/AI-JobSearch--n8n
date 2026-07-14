export interface JobSearchResult {
  external_job_id: string;
  source_platform: string;
  title: string;
  company_name: string;
  location: string;
  remote_status?: string;
  employment_type?: string;
  salary_range?: string;
  raw_description: string;
  application_url: string;
  posted_at?: Date;
}

export interface JobSearchCriteria {
  keywords: string;
  location?: string;
  remote?: boolean;
  limit?: number;
}

import { LinkedInMockConnector } from './connectors/LinkedInConnector';
import { IndeedMockConnector } from './connectors/IndeedConnector';

export interface IJobConnector {
  platformName: string;
  searchJobs(criteria: JobSearchCriteria): Promise<JobSearchResult[]>;
}

export class JobConnectorFactory {
  private connectors: Map<string, IJobConnector> = new Map();

  constructor() {
    this.registerConnector(new LinkedInMockConnector());
    this.registerConnector(new IndeedMockConnector());
  }

  registerConnector(connector: IJobConnector) {
    this.connectors.set(connector.platformName.toLowerCase(), connector);
  }

  getConnector(platformName: string): IJobConnector {
    const connector = this.connectors.get(platformName.toLowerCase());
    if (!connector) {
      throw new Error(`Connector for platform ${platformName} not found`);
    }
    return connector;
  }

  getAllConnectors(): IJobConnector[] {
    return Array.from(this.connectors.values());
  }
}

export const jobConnectorFactory = new JobConnectorFactory();

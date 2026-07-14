import { IJobConnector, JobSearchCriteria, JobSearchResult } from '../JobConnectorFactory';
import { logger } from '../../../config/logger';

export class IndeedMockConnector implements IJobConnector {
  platformName = 'indeed';

  async searchJobs(criteria: JobSearchCriteria): Promise<JobSearchResult[]> {
    logger.info(`[Indeed Connector] Searching jobs for keywords: ${criteria.keywords}`);
    
    return [
      {
        external_job_id: `ind-${Date.now()}-2`,
        source_platform: this.platformName,
        title: `${criteria.keywords} Developer`,
        company_name: 'GlobalCorp',
        location: criteria.location || 'New York, NY',
        remote_status: criteria.remote ? 'remote' : 'onsite',
        employment_type: 'Contract',
        salary_range: '$80/hr - $100/hr',
        raw_description: 'Seeking a fast-paced developer. Must know TypeScript and Node.js.',
        application_url: 'https://indeed.com/viewjob?jk=67890',
        posted_at: new Date()
      }
    ];
  }
}

import { IJobConnector, JobSearchCriteria, JobSearchResult } from '../JobConnectorFactory';
import { logger } from '../../../config/logger';

export class LinkedInMockConnector implements IJobConnector {
  platformName = 'linkedin';

  async searchJobs(criteria: JobSearchCriteria): Promise<JobSearchResult[]> {
    logger.info(`[LinkedIn Connector] Searching jobs for keywords: ${criteria.keywords}`);
    
    // In a real scenario, this would make an API call to a provider like RapidAPI JSearch
    // or proxycurl. For this robust implementation, we simulate an API response.
    
    return [
      {
        external_job_id: `li-${Date.now()}-1`,
        source_platform: this.platformName,
        title: `Senior ${criteria.keywords} Engineer`,
        company_name: 'TechNova',
        location: criteria.location || 'Remote',
        remote_status: criteria.remote ? 'remote' : 'hybrid',
        employment_type: 'Full-time',
        salary_range: '$120k - $150k',
        raw_description: 'We are looking for a senior engineer with 5+ years of experience in modern web frameworks.',
        application_url: 'https://linkedin.com/jobs/view/12345',
        posted_at: new Date()
      }
    ];
  }
}

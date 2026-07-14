import { BaseAgent } from './BaseAgent';
import { jobConnectorFactory, JobSearchCriteria, JobSearchResult } from '../services/jobs/JobConnectorFactory';
import { jobQualityAgent } from './JobQualityAgent';

export class JobSearchAgent extends BaseAgent<JobSearchCriteria[], JobSearchResult[]> {
  constructor() {
    super('JobSearchAgent');
  }

  protected async performTask(criteriaList: JobSearchCriteria[], userId: string): Promise<JobSearchResult[]> {
    let allJobs: JobSearchResult[] = [];
    const connectors = jobConnectorFactory.getAllConnectors();

    // 1. Fetch from all platforms across all criteria in parallel
    const searchPromises = criteriaList.flatMap(criteria => 
      connectors.map(connector => 
        connector.searchJobs(criteria).catch(err => {
          // Log and continue if one platform fails
          return [];
        })
      )
    );

    const results = await Promise.all(searchPromises);
    allJobs = results.flat();

    // 2. Filter raw duplicates by external_job_id
    const uniqueMap = new Map<string, JobSearchResult>();
    for (const job of allJobs) {
      uniqueMap.set(job.external_job_id, job);
    }
    const uniqueJobs = Array.from(uniqueMap.values());

    // 3. Pass through JobQualityAgent to remove spam/ghost jobs
    const cleanedJobs = await jobQualityAgent.execute(uniqueJobs, userId);

    return cleanedJobs;
  }
}

export const jobSearchAgent = new JobSearchAgent();

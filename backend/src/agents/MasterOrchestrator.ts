import { BaseAgent } from './BaseAgent';
import { plannerAgent } from './PlannerAgent';
import { jobSearchAgent } from './JobSearchAgent';
import { rankingAgent } from './RankingAgent';
import { applicationAgent, ApplicationPackage } from './ApplicationAgent';
import { query } from '../config/db';

export interface OrchestratorInput {
  resumeId: string;
  preferences: string;
}

export class MasterOrchestrator extends BaseAgent<OrchestratorInput, ApplicationPackage[]> {
  constructor() {
    super('MasterOrchestrator');
  }

  protected async performTask(input: OrchestratorInput, userId: string): Promise<ApplicationPackage[]> {
    // 1. Fetch Resume
    const resumeRes = await query('SELECT parsed_data FROM resumes WHERE id = $1 AND user_id = $2', [input.resumeId, userId]);
    if (!resumeRes.rows[0]) throw new Error('Resume not found');
    const resumeJson = resumeRes.rows[0].parsed_data;

    // 2. Planner Agent
    const searchStrategies = await plannerAgent.execute({ resumeJson, preferences: input.preferences }, userId);
    
    // 3. Job Search Agent
    const rawJobs = await jobSearchAgent.execute(searchStrategies, userId);

    // 4. Ranking Agent
    const rankedJobs = await rankingAgent.execute({ resumeJson, jobs: rawJobs }, userId);

    // Grab Top 3 jobs
    const topJobs = rankedJobs.slice(0, 3);

    // 5. Application Agent
    const applicationPackages: ApplicationPackage[] = [];
    for (const job of topJobs) {
      const pkg = await applicationAgent.execute({ resumeJson, rankedJob: job }, userId);
      applicationPackages.push(pkg);
      
      // Optionally insert into DB (companies, jobs, applications)
      // This ensures we log the fully built package
    }

    return applicationPackages;
  }
}

export const masterOrchestrator = new MasterOrchestrator();

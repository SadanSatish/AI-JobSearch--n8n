import { BaseAgent } from './BaseAgent';
import { atsService } from '../services/ai/AtsService';
import { JobSearchResult } from '../services/jobs/JobConnectorFactory';
import { jdParser } from '../services/ai/JdParserService';

export interface RankingInput {
  resumeJson: any;
  jobs: JobSearchResult[];
}

export interface RankedJob extends JobSearchResult {
  ats_score: number;
  semantic_score: number;
  overall_rank_score: number;
  gap_analysis: any;
}

export class RankingAgent extends BaseAgent<RankingInput, RankedJob[]> {
  constructor() {
    super('RankingAgent');
  }

  protected async performTask(input: RankingInput, userId: string): Promise<RankedJob[]> {
    const { resumeJson, jobs } = input;
    const rankedJobs: RankedJob[] = [];

    for (const job of jobs) {
      try {
        // Parse the JD first
        const jdJson = await jdParser.parseStructured(job.raw_description);
        
        // ATS Score against resume
        const score = await atsService.scoreResume(resumeJson, jdJson);
        
        // Custom semantic logic could be added here pulling from Qdrant, 
        // but for now, we use the LLM ATS score as base.
        const overall = (score.overall_score * 0.7) + (score.skill_match_score * 0.3);

        rankedJobs.push({
          ...job,
          ats_score: score.overall_score,
          semantic_score: score.skill_match_score,
          overall_rank_score: overall,
          gap_analysis: score
        });
      } catch (err: any) {
        // Skip failed jobs
      }
    }

    // Sort by rank descending
    return rankedJobs.sort((a, b) => b.overall_rank_score - a.overall_rank_score);
  }
}

export const rankingAgent = new RankingAgent();

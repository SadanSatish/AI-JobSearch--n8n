import { BaseAgent } from './BaseAgent';
import { RankedJob } from './RankingAgent';
import { coverLetterAgent } from './CoverLetterAgent';
import { optimizerService } from '../services/ai/OptimizerService';
import { jdParser } from '../services/ai/JdParserService';

export interface ApplicationInput {
  resumeJson: any;
  rankedJob: RankedJob;
}

export interface ApplicationPackage {
  optimizedResume: any;
  coverLetter: string;
  job: RankedJob;
}

export class ApplicationAgent extends BaseAgent<ApplicationInput, ApplicationPackage> {
  constructor() {
    super('ApplicationAgent');
  }

  protected async performTask(input: ApplicationInput, userId: string): Promise<ApplicationPackage> {
    const { resumeJson, rankedJob } = input;

    // 1. Get JD JSON
    const jdJson = await jdParser.parseStructured(rankedJob.raw_description);

    // 2. Generate Cover Letter
    const coverLetter = await coverLetterAgent.execute({ resumeJson, jdJson }, userId);

    // 3. Optimize Resume
    let optimizedResume = resumeJson;
    if (rankedJob.gap_analysis && rankedJob.gap_analysis.missing_keywords) {
      optimizedResume = await optimizerService.optimizeResume(resumeJson, rankedJob.gap_analysis.missing_keywords);
    }

    return {
      job: rankedJob,
      optimizedResume,
      coverLetter
    };
  }
}

export const applicationAgent = new ApplicationAgent();

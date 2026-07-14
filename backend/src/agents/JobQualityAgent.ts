import { BaseAgent } from './BaseAgent';
import { aiProvider } from '../services/ai/AiProviderService';
import { promptManager } from '../services/ai/PromptManager';
import { z } from 'zod';
import { JobSearchResult } from '../services/jobs/JobConnectorFactory';

promptManager.registerPrompt({
  id: 'evaluate_job_quality',
  category: 'scoring',
  description: 'Evaluates a job posting for scams, ghost jobs, or low quality.',
  template: `You are an expert HR Analyst and Scam Detector.
Analyze the following Job Posting. Flag it if it looks like a scam, a ghost-job, or lacks critical requirements.
Evaluate and output a strict JSON:
{
  "is_valid": true or false,
  "confidence_score": 0-100,
  "flags": ["list of red flags if any"]
}
Job Title: {{title}}
Company: {{company}}
Description: {{description}}
Return ONLY valid JSON.`,
  schema: z.object({
    is_valid: z.boolean(),
    confidence_score: z.number(),
    flags: z.array(z.string())
  })
});

export class JobQualityAgent extends BaseAgent<JobSearchResult[], JobSearchResult[]> {
  constructor() {
    super('JobQualityAgent');
  }

  protected async performTask(jobs: JobSearchResult[], userId: string): Promise<JobSearchResult[]> {
    const validJobs: JobSearchResult[] = [];

    // Process in batches or concurrently
    const evaluations = await Promise.allSettled(
      jobs.map(async (job) => {
        const prompt = promptManager.buildPrompt('evaluate_job_quality', {
          title: job.title,
          company: job.company_name,
          description: job.raw_description
        });

        const outputText = await aiProvider.generateText(prompt);
        const evaluation = promptManager.validateOutput('evaluate_job_quality', outputText);
        
        return { job, evaluation };
      })
    );

    for (const result of evaluations) {
      if (result.status === 'fulfilled') {
        const { job, evaluation } = result.value;
        if (evaluation.is_valid && evaluation.confidence_score > 60) {
          validJobs.push(job);
        }
      }
    }

    return validJobs;
  }
}

export const jobQualityAgent = new JobQualityAgent();

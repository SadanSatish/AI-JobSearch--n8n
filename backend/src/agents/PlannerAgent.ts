import { BaseAgent } from './BaseAgent';
import { aiProvider } from '../services/ai/AiProviderService';
import { promptManager } from '../services/ai/PromptManager';
import { z } from 'zod';
import { JobSearchCriteria } from '../services/jobs/JobConnectorFactory';

promptManager.registerPrompt({
  id: 'plan_job_search',
  category: 'optimization',
  description: 'Generates an array of search queries based on a candidates resume.',
  template: `You are an expert Career Strategist.
Based on the Candidate's Resume, generate 3 highly targeted job search queries to use on platforms like LinkedIn or Indeed.
Output strict JSON:
{
  "strategies": [
    {
      "keywords": "string",
      "location": "string",
      "remote": true
    }
  ]
}
Candidate Resume:
{{resume_json}}

Preferences:
{{preferences}}
Return ONLY valid JSON.`,
  schema: z.object({
    strategies: z.array(z.object({
      keywords: z.string(),
      location: z.string().optional(),
      remote: z.boolean().optional()
    }))
  })
});

export interface PlannerInput {
  resumeJson: any;
  preferences: string;
}

export class PlannerAgent extends BaseAgent<PlannerInput, JobSearchCriteria[]> {
  constructor() {
    super('PlannerAgent');
  }

  protected async performTask(input: PlannerInput, userId: string): Promise<JobSearchCriteria[]> {
    const prompt = promptManager.buildPrompt('plan_job_search', {
      resume_json: JSON.stringify(input.resumeJson),
      preferences: input.preferences || 'Remote preferred'
    });

    const outputText = await aiProvider.generateText(prompt);
    const parsed = promptManager.validateOutput('plan_job_search', outputText);
    
    return parsed.strategies;
  }
}

export const plannerAgent = new PlannerAgent();

import { BaseAgent } from './BaseAgent';
import { aiProvider } from '../services/ai/AiProviderService';
import { promptManager } from '../services/ai/PromptManager';
import { z } from 'zod';

promptManager.registerPrompt({
  id: 'generate_cover_letter',
  category: 'optimization',
  description: 'Generates a tailored cover letter based on Resume and Job Description.',
  template: `You are an expert Resume Writer.
Write a professional, compelling Cover Letter for the candidate applying to this Job.
Focus on the overlap between the candidate's skills and the job requirements. Keep it under 350 words.
Output strict JSON:
{
  "cover_letter": "The full text of the cover letter."
}
Candidate Resume:
{{resume_json}}

Job Description:
{{jd_json}}
Return ONLY valid JSON.`,
  schema: z.object({
    cover_letter: z.string()
  })
});

export interface CoverLetterInput {
  resumeJson: any;
  jdJson: any;
}

export class CoverLetterAgent extends BaseAgent<CoverLetterInput, string> {
  constructor() {
    super('CoverLetterAgent');
  }

  protected async performTask(input: CoverLetterInput, userId: string): Promise<string> {
    const prompt = promptManager.buildPrompt('generate_cover_letter', {
      resume_json: JSON.stringify(input.resumeJson),
      jd_json: JSON.stringify(input.jdJson)
    });

    const outputText = await aiProvider.generateText(prompt);
    const parsed = promptManager.validateOutput('generate_cover_letter', outputText);
    
    return parsed.cover_letter;
  }
}

export const coverLetterAgent = new CoverLetterAgent();

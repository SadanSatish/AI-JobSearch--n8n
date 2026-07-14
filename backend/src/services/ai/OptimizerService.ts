import { aiProvider } from './AiProviderService';
import { promptManager } from './PromptManager';
import { logger } from '../../config/logger';
import { z } from 'zod';

promptManager.registerPrompt({
  id: 'optimize_resume',
  category: 'optimization',
  description: 'Rewrites and optimizes the resume based on missing keywords and ATS gaps.',
  template: `You are an expert Resume Writer and Career Coach.
Take the existing candidate's Resume JSON, and rewrite the summary, skills, and experience bullet points to integrate the Missing Keywords.
Make the bullet points achievement-oriented and ATS-friendly.
Ensure the output matches the original structure but with improved content.
Return a strict JSON object:
{
  "skills": [...],
  "experience": [...],
  "education": [...]
}
Resume JSON:
{{resume_json}}

Missing Keywords to inject seamlessly:
{{missing_keywords}}
Return ONLY valid JSON without markdown wrapping.`,
  schema: z.object({
    skills: z.array(z.string()),
    experience: z.array(z.object({
      company: z.string(),
      title: z.string(),
      duration: z.string().optional(),
      description: z.string().optional()
    })).optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string().optional()
    })).optional()
  })
});

export class OptimizerService {
  async optimizeResume(resumeJson: any, missingKeywords: string[]): Promise<any> {
    try {
      const prompt = promptManager.buildPrompt('optimize_resume', {
        resume_json: JSON.stringify(resumeJson),
        missing_keywords: missingKeywords.join(', ')
      });
      
      const outputText = await aiProvider.generateText(prompt);
      return promptManager.validateOutput('optimize_resume', outputText);
    } catch (error: any) {
      logger.error('Resume Optimization Failed', { error: error.message });
      throw new Error('Failed to optimize resume');
    }
  }
}

export const optimizerService = new OptimizerService();

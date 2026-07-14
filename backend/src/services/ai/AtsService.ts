import { aiProvider } from './AiProviderService';
import { promptManager } from './PromptManager';
import { logger } from '../../config/logger';
import { z } from 'zod';

promptManager.registerPrompt({
  id: 'ats_score',
  category: 'scoring',
  description: 'Compares resume JSON against JD JSON and provides a gap analysis and ATS score.',
  template: `You are an expert ATS (Applicant Tracking System) simulator.
Compare the candidate's Resume against the Job Description (JD).
Evaluate the match and return a strict JSON object with scores and gap analysis.
Ensure the JSON has the following structure:
{
  "overall_score": 85,
  "keyword_match_score": 90,
  "skill_match_score": 80,
  "experience_score": 85,
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"]
}
Resume JSON:
{{resume_json}}

Job Description JSON:
{{jd_json}}
Return ONLY valid JSON without markdown wrapping.`,
  schema: z.object({
    overall_score: z.number(),
    keyword_match_score: z.number(),
    skill_match_score: z.number(),
    experience_score: z.number(),
    missing_keywords: z.array(z.string()),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string())
  })
});

export class AtsService {
  async scoreResume(resumeJson: any, jdJson: any): Promise<any> {
    try {
      const prompt = promptManager.buildPrompt('ats_score', {
        resume_json: JSON.stringify(resumeJson),
        jd_json: JSON.stringify(jdJson)
      });
      
      const outputText = await aiProvider.generateText(prompt);
      return promptManager.validateOutput('ats_score', outputText);
    } catch (error: any) {
      logger.error('ATS Scoring Failed', { error: error.message });
      throw new Error('Failed to generate ATS score');
    }
  }
}

export const atsService = new AtsService();

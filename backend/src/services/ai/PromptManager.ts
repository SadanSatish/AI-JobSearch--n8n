import { z } from 'zod';
import { logger } from '../../config/logger';

export interface PromptTemplate {
  id: string;
  template: string;
  description: string;
  category: 'parsing' | 'optimization' | 'scoring';
  schema?: z.ZodSchema<any>;
}

export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.registerDefaultPrompts();
  }

  registerPrompt(prompt: PromptTemplate) {
    this.templates.set(prompt.id, prompt);
  }

  getPrompt(id: string): PromptTemplate {
    const prompt = this.templates.get(id);
    if (!prompt) {
      throw new Error(`Prompt template '${id}' not found`);
    }
    return prompt;
  }

  buildPrompt(id: string, variables: Record<string, string>): string {
    const promptDef = this.getPrompt(id);
    let finalPrompt = promptDef.template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalPrompt = finalPrompt.replace(regex, value);
    }
    
    return finalPrompt;
  }

  validateOutput(id: string, output: any): any {
    const promptDef = this.getPrompt(id);
    if (promptDef.schema) {
      try {
        let parsedOutput = output;
        if (typeof output === 'string') {
          // Attempt to strip markdown code blocks if the AI wraps it
          const jsonMatch = output.match(/```(?:json)?([\s\S]*?)```/);
          if (jsonMatch) {
            parsedOutput = jsonMatch[1].trim();
          }
          parsedOutput = JSON.parse(parsedOutput);
        }
        return promptDef.schema.parse(parsedOutput);
      } catch (error) {
        logger.error(`Validation failed for prompt ${id}`, { error });
        throw new Error(`Output validation failed for prompt ${id}`);
      }
    }
    return output;
  }

  private registerDefaultPrompts() {
    this.registerPrompt({
      id: 'parse_resume',
      category: 'parsing',
      description: 'Extracts structured data from raw resume text',
      template: `You are an expert ATS (Applicant Tracking System) parser.
Extract the following information from the provided resume text into a strict JSON object.
Ensure the JSON has the following structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [{ "company": "...", "title": "...", "duration": "...", "description": "..." }],
  "education": [{ "institution": "...", "degree": "...", "year": "..." }]
}
Resume Text:
{{resume_text}}
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
    
    // Add jd_parse prompt as well
    this.registerPrompt({
      id: 'parse_jd',
      category: 'parsing',
      description: 'Extracts structured data from raw JD text',
      template: `You are an expert HR systems parser.
Extract the following information from the provided job description text into a strict JSON object.
Ensure the JSON has the following structure:
{
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill3"],
  "experience_years_required": "string or number",
  "keywords": ["keyword1"]
}
Job Description:
{{jd_text}}
Return ONLY valid JSON without markdown wrapping.`,
      schema: z.object({
        required_skills: z.array(z.string()),
        preferred_skills: z.array(z.string()).optional(),
        experience_years_required: z.any().optional(),
        keywords: z.array(z.string()).optional()
      })
    });
  }
}

export const promptManager = new PromptManager();

import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { aiProvider } from './AiProviderService';
import { promptManager } from './PromptManager';
import { logger } from '../../config/logger';

export class ResumeParserService {
  /**
   * Extracts raw text from a PDF or DOCX file
   */
  async extractText(filePath: string, mimeType: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    
    if (mimeType === 'application/pdf') {
      // @ts-ignore
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type for parsing');
    }
  }

  /**
   * Pushes raw text through the AI to extract structured data
   */
  async parseStructured(rawText: string): Promise<any> {
    try {
      const prompt = promptManager.buildPrompt('parse_resume', { resume_text: rawText });
      const outputText = await aiProvider.generateText(prompt);
      
      const validatedJson = promptManager.validateOutput('parse_resume', outputText);
      return validatedJson;
    } catch (error: any) {
      logger.error('Failed to parse resume into structured JSON', { error: error.message });
      throw new Error('AI parsing failed');
    }
  }
}

export const resumeParser = new ResumeParserService();

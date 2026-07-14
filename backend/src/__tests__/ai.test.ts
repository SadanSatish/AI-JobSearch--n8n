import { aiProvider } from '../services/ai/AiProviderService';
import { promptManager } from '../services/ai/PromptManager';
import { resumeParser } from '../services/ai/ResumeParserService';

jest.mock('../services/ai/AiProviderService', () => ({
  aiProvider: {
    generateText: jest.fn(),
    generateEmbeddings: jest.fn()
  }
}));

describe('AI Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Resume Parser', () => {
    it('should parse raw text into structured JSON', async () => {
      const mockAiResponse = JSON.stringify({
        skills: ['React', 'TypeScript'],
        experience: [{ company: 'Tech Inc', title: 'Developer', duration: '2020-2022' }],
        education: []
      });

      (aiProvider.generateText as jest.Mock).mockResolvedValue(mockAiResponse);

      const result = await resumeParser.parseStructured('I worked at Tech Inc as a Developer.');

      expect(aiProvider.generateText).toHaveBeenCalled();
      expect(result.skills).toContain('React');
      expect(result.experience[0].company).toBe('Tech Inc');
    });
  });

  describe('Prompt Manager', () => {
    it('should inject variables into prompts', () => {
      const prompt = promptManager.buildPrompt('parse_resume', { resume_text: 'Dummy Resume Text' });
      expect(prompt).toContain('Dummy Resume Text');
    });

    it('should validate JSON against Zod schema', () => {
      const validOutput = {
        skills: ['Node.js'],
        experience: [],
        education: []
      };

      const result = promptManager.validateOutput('parse_resume', validOutput);
      expect(result.skills).toContain('Node.js');
    });

    it('should throw an error for invalid output', () => {
      const invalidOutput = {
        skills: 'Not an array', // Should be an array
        experience: []
      };

      expect(() => {
        promptManager.validateOutput('parse_resume', invalidOutput);
      }).toThrow();
    });
  });
});

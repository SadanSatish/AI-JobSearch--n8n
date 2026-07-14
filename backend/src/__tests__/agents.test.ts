import { plannerAgent } from '../agents/PlannerAgent';
import { aiProvider } from '../services/ai/AiProviderService';
import { JobSearchCriteria } from '../services/jobs/JobConnectorFactory';

jest.mock('../services/ai/AiProviderService', () => ({
  aiProvider: {
    generateText: jest.fn()
  }
}));

jest.mock('../config/db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [{ id: 'mocked-run-id' }] })
}));

describe('Multi-Agent System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Planner Agent', () => {
    it('should extract targeted job search criteria', async () => {
      const mockResponse = JSON.stringify({
        strategies: [
          { keywords: 'Frontend Engineer', location: 'Remote', remote: true }
        ]
      });
      (aiProvider.generateText as jest.Mock).mockResolvedValue(mockResponse);

      const criteria = await plannerAgent.execute({ resumeJson: {}, preferences: 'Remote' }, 'test-user-id');
      
      expect(criteria.length).toBe(1);
      expect(criteria[0].keywords).toBe('Frontend Engineer');
      expect(criteria[0].remote).toBe(true);
    });
  });
});

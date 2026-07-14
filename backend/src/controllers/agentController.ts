import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { masterOrchestrator } from '../agents/MasterOrchestrator';

export class AgentController {
  static async triggerPipeline(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId, preferences } = req.body;
      
      // Start the master orchestrator in the background and respond immediately 
      // if this is requested by a webhook from n8n (async processing).
      // Or we can await it if we want synchronous API behavior. Let's await for simplicity.
      
      const packages = await masterOrchestrator.execute({ resumeId, preferences }, req.user!.id);
      
      res.status(200).json({ status: 'success', data: packages });
    } catch (error) {
      next(error);
    }
  }
}

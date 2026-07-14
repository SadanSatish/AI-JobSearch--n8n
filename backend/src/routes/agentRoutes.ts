import { Router } from 'express';
import { AgentController } from '../controllers/agentController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/trigger-pipeline', AgentController.triggerPipeline);

export default router;

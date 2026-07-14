import { Router } from 'express';
import { AiController } from '../controllers/aiController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/resume/parse', AiController.parseResume);
router.post('/jd/parse', AiController.parseJd);
router.post('/ats/score', AiController.scoreAts);
router.post('/resume/optimize', AiController.optimizeResume);

export default router;

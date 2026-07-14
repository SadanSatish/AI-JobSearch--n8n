import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', JobController.getJobs);

export default router;

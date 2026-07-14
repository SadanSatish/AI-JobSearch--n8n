import { Router } from 'express';
import { SystemController } from '../controllers/systemController';

const router = Router();

router.get('/health', SystemController.getHealth);
router.get('/version', SystemController.getVersion);

export default router;

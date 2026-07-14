import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);
router.get('/profile', UserController.getProfile);

export default router;

import { Router } from 'express';
import { getReviews, createReview } from '../controller/review.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', authMiddleware, createReview);

export default router;

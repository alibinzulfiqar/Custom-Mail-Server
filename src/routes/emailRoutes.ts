import { Router } from 'express';
import { sendEmail, testEndpoint } from '../controllers/emailController';
import { authenticate, emailRateLimiter } from '../middleware';

const router = Router();

/**
 * @route   POST /api/email/send
 * @desc    Send an email
 * @access  Private (API Key required)
 */
router.post('/send', authenticate, emailRateLimiter, sendEmail);

/**
 * @route   GET /api/email/test
 * @desc    Test API authentication
 * @access  Private (API Key required)
 */
router.get('/test', authenticate, testEndpoint);

export default router;

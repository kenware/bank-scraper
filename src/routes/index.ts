import express from 'express';
import healthRoute from './health';

const router = express.Router();

router.use('/', healthRoute);
router.use('/health', healthRoute);

export default router;

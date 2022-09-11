import express from 'express';
import healthRoute from './health';
import formatRoute from './formatter'

const router = express.Router();

router.use('/', healthRoute);
router.use('/format', formatRoute)
router.use('/health', healthRoute);

export default router;

import express from 'express';
import healthRoute from './health';
import scrapeRoute from './scraper'

const router = express.Router();

router.use('/', healthRoute);
router.use('/scraper', scrapeRoute)
router.use('/health', healthRoute);

export default router;

import express from 'express';
import ScraperController from '../controller/scraper';

const router = express.Router();

router.get('/okrabank', ScraperController.scrapeBank)

export default router;

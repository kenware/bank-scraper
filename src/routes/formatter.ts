import express from 'express';
import ScraperController from '../controller/formatter';

const router = express.Router();

router.post('/clean', ScraperController.formatData)
router.post('/save', ScraperController.saveFormatteData)

export default router;

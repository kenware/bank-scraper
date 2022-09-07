import express from 'express';
import BaseController from '../controller';

const router = express.Router();

router.get('/', (req, res) => BaseController.successHandler(req, res, 'Server is running'))

export default router;

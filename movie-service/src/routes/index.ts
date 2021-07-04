import express from 'express';

import movieRouter from './movie';

const router = express.Router();

router.use('/movies', movieRouter);

export default router;

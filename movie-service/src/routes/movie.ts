import express from 'express';

import { createMovie, getMovies } from '../controllers/movie';
import {checkAuth, checkPackage} from '../middlewares/auth';

const router = express.Router();

router.get('', checkAuth, getMovies);
router.post('', checkAuth, checkPackage, createMovie);

export default router;

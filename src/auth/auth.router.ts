import * as express from 'express';
import {
    signup,
    signin
} from './auth.controller';
import { authorization } from '../core/middleware/auth.middleware'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

export default router;
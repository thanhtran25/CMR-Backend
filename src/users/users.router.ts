import * as express from 'express';
import {
    signup,
    signin
} from './users.controller'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

export default router;
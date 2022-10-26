import * as express from 'express';
import {
    signup,
    signin,
    forgotPassword,
    resetPassword
} from './auth.controller';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/password-forgot', forgotPassword);
router.post('/password-reset/', resetPassword);

export default router;
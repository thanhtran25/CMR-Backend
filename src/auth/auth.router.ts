import * as express from 'express';
import {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    getGoogleAuthURL,
    getUserFromCode,
    confirmAccount,
    resendOTP
} from './auth.controller';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/password-forgot', forgotPassword);
router.post('/password-reset', resetPassword);
router.post('/signup/confirm', confirmAccount);
router.post('/signup/resend-otp', resendOTP);
router.get('/google/login', getGoogleAuthURL);
router.get('/google', getUserFromCode);

export default router;
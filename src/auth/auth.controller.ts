import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as authService from './auth.service'
import { ConfirmAccountDTO, ForgotPasswordDTO, LoginDTO, ResendOTPDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            fullname: Joi.string().max(255).required(),
            birthday: Joi.date(),
            gender: Joi.string().default(Gender.MALE),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
        });

        const value = validate<SignupDTO>(req.body, schema);
        await authService.signup(value)
        return res.status(201).send();

    } catch (error) {
        return next(error);
    }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        });

        const { email, password } = validate<LoginDTO>(req.body, schema);

        const result = await authService.signin(email, password);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const value = validate<ForgotPasswordDTO>(req.body, schema);

        await authService.forgotPassword(value);
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
            password: Joi.string().required(),
            token: Joi.string().required(),
        });

        const value = validate<ResetPasswordDTO>(req.body, schema);

        await authService.resetPassword(value);
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

export async function getGoogleAuthURL(req: Request, res: Response, next: NextFunction) {
    const loginUrl = authService.getGoogleAuthURL()
    res.redirect(loginUrl)
}

export async function getUserFromCode(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            code: Joi.string().required(),
        });

        const { code } = validate(req.query, schema, { allowUnknown: true });

        const data = await authService.getGoogleUser(code)
        res.cookie('Token', data.accessToken, {
        })
        res.cookie('user', JSON.stringify(data.information), {
        })
        res.cookie('hasPassword', data.hasPassword, {
        })
        res.redirect(process.env.WEB_URI)
    } catch (error) {
        return next(error);
    }
}

export async function confirmAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().required(),
            otp: Joi.number().required(),
        });

        const value = validate<ConfirmAccountDTO>(req.body, schema);

        await authService.confirmAccount(value)
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

export async function resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().required(),
        });

        const value = validate<ResendOTPDTO>(req.body, schema);

        await authService.resendOTP(value)
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}



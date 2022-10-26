import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as authService from './auth.service'
import { ForgotPasswordDTO, LoginDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';

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
            role: Joi.string().default(Roles.CUSTOMER),
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
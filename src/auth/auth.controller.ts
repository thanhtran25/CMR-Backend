import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as userService from './auth.service'

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            fullname: Joi.string().max(255).required(),
            birthday: Joi.date(),
            gender: Joi.string().default(Gender.MALE),
            address: Joi.string().max(255),
            numberPhone: Joi.string().min(10).max(11),
            role: Joi.string().default(Roles.CUSTOMER),
        });

        const value = validate(req.body, schema);
        const result = await userService.signup(value)
        return res.status(201).send(result);

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

        const { email, password } = validate(req.body, schema);

        const result = await userService.signin(email, password);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

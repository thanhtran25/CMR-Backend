import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as userService from './users.service';

export async function createUser(req: Request, res: Response, next: NextFunction) {
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

        const value = validate(req.body, schema);
        const result = await userService.createUser(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            password: Joi.string().min(8),
            fullname: Joi.string().max(255),
            birthday: Joi.date(),
            gender: Joi.string().default(Gender.MALE),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
            role: Joi.string().default(Roles.CUSTOMER),
        });

        const value = validate(req.body, schema);
        const result = await userService.updateUser(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userService.deleteUser(parseInt(req.params.id))
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
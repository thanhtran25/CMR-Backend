import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as userService from './users.service';
import { ChangePassword, ChangePosition, CreateUserDTO, FilterUser, UpdateUserDTO } from './users.dto';
import { PAGINATION } from '../core/constant';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const pageNumber = +req.query.page || PAGINATION.DEFAULT_PAGE_NUMBER;
        const pageSize = +req.query.limit || PAGINATION.DEFAULT_PAGE_SIZE;

        let filter = new FilterUser();
        console.log(req.query.name);

        filter.name = req.query.name as string;
        filter.address = req.query.address as string;
        filter.gender = req.query.gender as Gender;

        const result = await userService.getUsers(pageNumber, pageSize, filter);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userService.getUser(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

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

        const value = validate<CreateUserDTO>(req.body, schema);

        const result = await userService.createUser(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            fullname: Joi.string().max(255),
            birthday: Joi.date(),
            gender: Joi.string().default(Gender.MALE),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
        });

        const value = validate<UpdateUserDTO>(req.body, schema);
        const result = await userService.updateUser(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.deleteUser(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            currentPassword: Joi.string().min(8).required(),
            newPassword: Joi.string().min(8).required()
        });

        const value = validate<ChangePassword>(req.body, schema);
        await userService.changePassword(value, req.user.email);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

export async function changePosition(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            id: Joi.number(),
            role: Joi.string().required()
        });
        const value = validate<ChangePosition>({ id: req.user.id, ...req.body }, schema);

        await userService.changePosition(value);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}
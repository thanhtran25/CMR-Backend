import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as userService from './users.service';
import { ChangePasswordDTO, ChangePositionDTO, CreateUserDTO, UpdateUserDTO } from './users.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            fullname: Joi.string().allow(''),
            gender: Joi.string().valid(...Object.values(Gender)).allow(''),
            address: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await userService.getUsers(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getLockedUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            fullname: Joi.string().allow(''),
            gender: Joi.string().valid(...Object.values(Gender)).allow(''),
            address: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await userService.getLockedUsers(query);
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

        const value = validate<ChangePasswordDTO>(req.body, schema);
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
        const value = validate<ChangePositionDTO>({ id: req.params.id, ...req.body }, schema);

        await userService.changePosition(value);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

export async function recoverUser(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.recoverUser(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
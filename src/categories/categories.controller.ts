import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as categoryService from './categories.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await categoryService.getCategories(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await categoryService.getCategory(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const value = validate<CreateCategoryDTO>(req.body, schema);

        const result = await categoryService.createCategory(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
        });

        const value = validate<UpdateCategoryDTO>(req.body, schema);
        const result = await categoryService.updateCategory(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        await categoryService.deleteCategory(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

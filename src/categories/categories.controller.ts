import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Gender, Roles } from '../core/enum';
import { validate } from '../core/utils/validate.util';
import * as categoryService from './categories.service';
import { CreateCategoryDTO, FilterCategory, UpdateCategoryDTO } from './categories.dto';
import { PAGINATION } from '../core/constant';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const pageNumber = +req.query.page || PAGINATION.DEFAULT_PAGE_NUMBER;
        const pageSize = +req.query.limit || PAGINATION.DEFAULT_PAGE_SIZE;

        let filter = new FilterCategory();

        filter.name = req.query.name as string;

        const result = await categoryService.getCategories(pageNumber, pageSize, filter);
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
            name: Joi.string().required(),
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

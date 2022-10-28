import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as branchService from './brands.service';
import { CreateBranchDTO, UpdateBranchDTO } from './brands.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getBrands(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await branchService.getBrands(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

export async function getBrand(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await branchService.getBrand(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createBrand(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const value = validate<CreateBranchDTO>(req.body, schema);

        const result = await branchService.createBrand(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const value = validate<UpdateBranchDTO>(req.body, schema);
        const result = await branchService.updateBrand(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
        await branchService.deleteBrand(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

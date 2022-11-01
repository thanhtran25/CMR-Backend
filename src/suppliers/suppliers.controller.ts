import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as supplierService from './suppliers.service';
import { CreateSupplierDTO, UpdateSupplierDTO } from './suppliers.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await supplierService.getSuppliers(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getSupplier(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await supplierService.getSupplier(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().max(255).required(),
            numberPhone: Joi.string().min(10).max(11),
        });

        const value = validate<CreateSupplierDTO>(req.body, schema);

        const result = await supplierService.createSupplier(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            address: Joi.string().max(255),
            numberPhone: Joi.string().min(10).max(11),
        });

        const value = validate<UpdateSupplierDTO>(req.body, schema);
        const result = await supplierService.updateSupplier(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
        await supplierService.deleteSupplier(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';
import * as saleCodeService from './sale_codes.service'
import { CreateSaleCodeDTO, UpdateSaleCodeDTO } from './sale_codes.dto';

export async function getSaleCodes(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            percent: Joi.number().allow(''),
            startDate: Joi.date().allow(''),
            endDate: Joi.date().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await saleCodeService.getSaleCodes(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

export async function getSaleCode(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await saleCodeService.getSaleCode(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createSaleCode(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().max(255).required(),
            percent: Joi.number().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            productIds: Joi.array().items(Joi.number())
        })

        const value = validate<CreateSaleCodeDTO>(req.body, schema);

        const result = await saleCodeService.createSaleCode(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateSaleCode(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().max(255),
            percent: Joi.number(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            newProductIds: Joi.array().items(Joi.number()),
            removeProductIds: Joi.array().items(Joi.number()),
        })

        const value = validate<UpdateSaleCodeDTO>(req.body, schema);

        const result = await saleCodeService.updateSaleCode(parseInt(req.params.id), value);
        res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteSaleCode(req: Request, res: Response, next: NextFunction) {
    try {
        await saleCodeService.deleteSaleCode(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
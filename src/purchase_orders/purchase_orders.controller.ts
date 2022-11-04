import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';
import * as purchaseOrderService from './purchase_orders.service'
import { createPurchaseOrderDTO } from './purchase_orders.dto';
import { number } from 'joi';

export async function getPurchaseOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            staffId: Joi.number().allow(''),
            supplierId: Joi.number().allow('')
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await purchaseOrderService.getPurchaseOrders(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

export async function getPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await purchaseOrderService.getPurchaseOrder(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            supplierId: Joi.number().required(),
            details: Joi.array().items({
                count: Joi.number().required(),
                price: Joi.number().required(),
                productId: Joi.number().required(),
            }).min(1).required(),
            inventoryId: Joi.number().required(),
            staffId: Joi.number().required()
        })


        const value = validate<createPurchaseOrderDTO>({
            ...req.body,
            staffId: req.user.id
        }, schema);

        const result = await purchaseOrderService.createPurchaseOrder(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updatePurchaseOrder(req: Request, res: Response, next: NextFunction) {

}

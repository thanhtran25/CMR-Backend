import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as inventoryService from './inventories.service';
import { CreateInventoryDTO, UpdateInventoryDTO } from './inventories.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getInventories(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
            address: Joi.string().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await inventoryService.getInventories(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inventoryService.getInventory(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required()
        });

        const value = validate<CreateInventoryDTO>(req.body, schema);

        const result = await inventoryService.createInventory(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required()
        });

        const value = validate<UpdateInventoryDTO>(req.body, schema);
        const result = await inventoryService.updateInventory(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}


import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as inventoryService from './inventories.service';
import { CreateInventoryDTO, UpdateInventoryDTO } from './inventories.dto';
import { PAGINATION } from '../core/constant';

export async function getInventories(req: Request, res: Response, next: NextFunction) {
    try {
        const pageNumber = +req.query.page || PAGINATION.DEFAULT_PAGE_NUMBER;
        const pageSize = +req.query.limit || PAGINATION.DEFAULT_PAGE_SIZE;

        const result = await inventoryService.getInventories(pageNumber, pageSize);
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
            sold: Joi.number().default(0),
            amount: Joi.number().required(),
            productId: Joi.number().required()
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
            sold: Joi.number().required(),
        });

        const value = validate<UpdateInventoryDTO>(req.body, schema);
        const result = await inventoryService.updateInventory(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}


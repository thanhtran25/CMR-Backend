import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';
import * as billService from './bills.service';
import { CreateBillDTO, ShippingDTO, UpdateBillDTO } from './bills.dto';
import { BillStatus, OrderStates } from '../core/enum';

export async function getBills(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            states: Joi.string().valid(...Object.values({ ...OrderStates })),
            shipperId: Joi.number(),
            numberPhone: Joi.string().allow('')
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await billService.getBills(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

export async function getBill(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await billService.getBill(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createBill(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            userId: Joi.number(),
            customerName: Joi.string().required(),
            address: Joi.string().required(),
            numberPhone: Joi.string().min(10).max(11).required(),
            states: Joi.string().default(OrderStates.WAITING),
            status: Joi.string().default(BillStatus.UNPAID),
            shippingFee: Joi.number().required(),
            details: Joi.array().items({
                count: Joi.number().required(),
                price: Joi.number().required(),
                productId: Joi.number().required(),
            }).min(1).required(),
        })

        let createBill = {
            ...req.body
        };

        if (req.user) {
            createBill.userId = req.user.id;
        }

        const value = validate<CreateBillDTO>(createBill, schema);

        const result = await billService.createBill(value);

        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

export async function acceptBill(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            states: Joi.string().required(),
            status: Joi.string().default(BillStatus.UNPAID)
        })
        const value = validate<UpdateBillDTO>(req.body, schema);

        await billService.acceptBill(+req.params.id, value);
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

export async function shipping(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            states: Joi.string().required(),
            status: Joi.string().default(BillStatus.UNPAID),
            shipperId: Joi.number().required()
        })
        const value = validate<ShippingDTO>({ ...req.body, shipperId: req.user.id }, schema);

        await billService.acceptBill(+req.params.id, value);
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            states: Joi.string().allow(''),
            userId: Joi.number().required()
        });
        const query: FilterPagination = validate<FilterPagination>({ userId: req.user.id, ...req.query }, schema);
        const result = await billService.getHistory(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
export async function getShippingFee(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            address: Joi.string(),
        });

        const { address } = validate(req.body, schema);
        console.log(address);

        const result = await billService.getShippingFee(address);
        return res.status(200).send({ result });

    } catch (error) {
        return next(error);
    }
}

import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as productService from './products.service';
import { CreateProductDTO, UpdateProductDTO } from './products.dto';
import { PAGINATION } from '../core/constant';
import { FilterPagination } from '../core/interfaces/filter.interface';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            description: Joi.string().allow(''),
            name: Joi.string().allow(''),
            brandId: Joi.number().allow(''),
            categoryId: Joi.number().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);
        const result = await productService.getProducts(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(PAGINATION.DEFAULT_PAGE_NUMBER).min(1),
            limit: Joi.number().default(PAGINATION.DEFAULT_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            description: Joi.string().allow(''),
            name: Joi.string().allow(''),
            brandId: Joi.number().allow(''),
            categoryId: Joi.number().allow(''),
        });

        const query: FilterPagination = validate<FilterPagination>(req.query, schema);

        const result = await productService.getSaleProducts(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await productService.getProduct(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string().required(),
            brandId: Joi.number().required(),
            categoryId: Joi.number().required(),
            saleCodeId: Joi.number(),
            images: Joi.array().required().min(2).max(2),
            warrantyPeriod: Joi.number().required()
        });

        console.log('image', req.files);

        const { images, amount, ...value } = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema)

        const result = await productService.createProduct({
            ...value,
            img1: images[0],
            img2: images[1],
        })
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            price: Joi.number(),
            description: Joi.string(),
            brandId: Joi.number(),
            categoryId: Joi.number(),
            saleCodeId: Joi.number(),
            images: Joi.any(),
            warrantyPeriod: Joi.number()
        });

        const { images, amount, ...value } = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema)

        const result = await productService.updateProduct(+req.params.id, {
            ...value,
            img1: images[0],
            img2: images[1],
        })
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        await productService.deleteProduct(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

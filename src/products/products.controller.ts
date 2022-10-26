import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as productService from './products.service';
import { CreateProductDTO, FilterProductDTO, UpdateProductDTO } from './products.dto';
import { PAGINATION } from '../core/constant';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const pageNumber = +req.query.page || PAGINATION.DEFAULT_PAGE_NUMBER;
        const pageSize = +req.query.limit || PAGINATION.DEFAULT_PAGE_SIZE;

        let filter = new FilterProductDTO();
        filter.name = req.query.name as string;
        filter.description = req.query.description as string;
        filter.brandId = +req.query.brandId as number;
        filter.categoryId = +req.query.categoryId as number;
        filter.saleCodeId = +req.query.saleCodeId as number;
        filter.order = req.query.order as string;

        const result = await productService.getProducts(pageNumber, pageSize, filter);
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
            amount: Joi.number().required()
        });

        const { images, amount, ...value } = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema)

        const result = await productService.createProduct({
            ...value,
            img1: images[0],
            img2: images[1],
        }, amount)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            price: Joi.number().required(),
            img1: Joi.string().required(),
            img2: Joi.string().required(),
            description: Joi.string().required(),
            brandId: Joi.number().required(),
            categoryId: Joi.number().required(),
            saleCodeId: Joi.number(),
        });

        const value = validate<UpdateProductDTO>(req.body, schema);
        const result = await productService.updateProduct(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        await productService.deleteUser(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

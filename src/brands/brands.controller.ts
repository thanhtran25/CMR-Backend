import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/validate.util';
import * as branchService from './brands.service';
import { CreateBranchDTO, FilterBranchDTO, UpdateBranchDTO } from './brands.dto';
import { PAGINATION } from '../core/constant';

export async function getBrands(req: Request, res: Response, next: NextFunction) {
    try {
        const pageNumber = +req.query.page || PAGINATION.DEFAULT_PAGE_NUMBER;
        const pageSize = +req.query.limit || PAGINATION.DEFAULT_PAGE_SIZE;

        let filter = new FilterBranchDTO();

        filter.name = req.query.name as string;

        const result = await branchService.getBrands(pageNumber, pageSize, filter);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function getBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await branchService.getBranch(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function createBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const value = validate<CreateBranchDTO>(req.body, schema);

        const result = await branchService.createBranch(value)
        return res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function updateBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
        });

        const value = validate<UpdateBranchDTO>(req.body, schema);
        const result = await branchService.updateBranch(parseInt(req.params.id), value)
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

export async function deleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
        await branchService.deleteBranch(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

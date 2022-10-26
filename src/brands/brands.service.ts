import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateBranchDTO, FilterBranchDTO, UpdateBranchDTO } from './brands.dto';
import { Like } from 'typeorm';
import { Brand } from './brands.entity';

const branchRepo = AppDataSource.getRepository(Brand);

export async function getBrands(pageNumber: number, pageSize: number, filter: FilterBranchDTO) {
    const offset = pageSize * (pageNumber - 1);
    const limit = pageSize;
    let where: {
        name?: any;
    } = {};

    if (filter.name) {
        where.name = Like(`%${filter.name}%`)
    }
    const categories = await branchRepo.find({
        skip: offset,
        take: limit,
        where: where
    });

    return categories;
}

export async function getBranch(id: number) {
    const branch = await branchRepo.findOneBy({
        id: id
    });
    if (!branch) {
        throw new BadRequest('Brand not found');
    }
    return branch;
}

export async function createBranch(createBranchDTO: CreateBranchDTO) {
    const duplicatedBranch = await branchRepo.findOneBy({
        name: createBranchDTO.name
    });
    if (duplicatedBranch) {
        throw new BadRequest('Brand name already existed');
    }
    const newBranch = new Brand(createBranchDTO);

    await branchRepo.save(newBranch);
    return newBranch;
}

export async function updateBranch(id: number, updateBranchDTO: UpdateBranchDTO) {
    let branch = await branchRepo.findOneBy({
        id: id
    });

    if (!branch) {
        throw new BadRequest('Brand not found');
    }
    branch = {
        ...branch,
        ...updateBranchDTO,
    }
    await branchRepo.update(id, branch);
    return branch;
}

export async function deleteBranch(id: number) {
    const branch = await branchRepo.findOneBy({
        id: id
    });

    if (!branch) {
        throw new BadRequest('Brand not found');
    }

    await branchRepo.softDelete(id);
}
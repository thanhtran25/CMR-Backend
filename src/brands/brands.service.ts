import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateBranchDTO, UpdateBranchDTO } from './brands.dto';
import { Brand } from './brands.entity';
import { buildPagination } from '../core/utils/paginantion.util';
import { FilterPagination } from '../core/interfaces/filter.interface';

const branchRepo = AppDataSource.getRepository(Brand);

export async function getBrands(filters: FilterPagination) {
    const query = buildPagination(Brand, filters)
    const brands = await branchRepo.find(query);
    return brands;
}

export async function getBrand(id: number) {
    const brand = await branchRepo.findOneBy({
        id: id
    });
    if (!brand) {
        throw new BadRequest('Brand not found');
    }
    return brand;
}

export async function createBrand(createBranchDTO: CreateBranchDTO) {
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

export async function updateBrand(id: number, updateBranchDTO: UpdateBranchDTO) {
    let brand = await branchRepo.findOneBy({
        id: id
    });

    if (!brand) {
        throw new BadRequest('Brand not found');
    }
    brand = {
        ...brand,
        ...updateBranchDTO,
    }
    await branchRepo.update(id, brand);
    return brand;
}

export async function deleteBrand(id: number) {
    const brand = await branchRepo.findOneBy({
        id: id
    });

    if (!brand) {
        throw new BadRequest('Brand not found');
    }

    await branchRepo.softDelete(id);
}
import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateSupplierDTO, UpdateSupplierDTO } from './suppliers.dto';
import { Supplier } from './suppliers.entity';
import { buildPagination } from '../core/utils/paginantion.util';
import { FilterPagination } from '../core/interfaces/filter.interface';

const supplierRepo = AppDataSource.getRepository(Supplier);

export async function getSuppliers(filters: FilterPagination) {
    const query = buildPagination(Supplier, filters)
    const [result, total] = await supplierRepo.findAndCount(query);
    return { totalPage: Math.ceil(total / filters.limit), suppliers: result };
}

export async function getSupplier(id: number) {
    const supplier = await supplierRepo.findOneBy({
        id: id
    });
    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    return supplier;
}

export async function createSupplier(createSupplierDTO: CreateSupplierDTO) {
    const duplicatedSupplier = await supplierRepo.findOneBy({
        name: createSupplierDTO.name
    });
    if (duplicatedSupplier) {
        throw new BadRequest('Supplier name already existed');
    }
    const newSupplier = new Supplier(createSupplierDTO);

    await supplierRepo.save(newSupplier);
    return newSupplier;
}

export async function updateSupplier(id: number, updateCategoryDTO: UpdateSupplierDTO) {
    const supplier = await supplierRepo.findOneBy({
        id: id
    });

    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    await supplierRepo.update(id, updateCategoryDTO);
    return supplier;
}

export async function deleteSupplier(id: number) {
    const supplier = await supplierRepo.findOneBy({
        id: id
    });

    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    await supplierRepo.softDelete(id);
}
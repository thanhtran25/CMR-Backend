import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { Product } from '../products/products.entity';
import { CreateSaleCodeDTO, UpdateSaleCodeDTO } from './sale_codes.dto';
import { SaleCode } from './sale_codes.entity';


const saleCodeRepo = AppDataSource.getRepository(SaleCode);

export async function getSaleCodes(filters: FilterPagination) {
    const query = buildPagination(SaleCode, filters)
    const [result, total] = await saleCodeRepo.findAndCount({
        ...query,
    });
    return { totalPage: Math.ceil(total / filters.limit), saleCodes: result };
}

export async function getSaleCode(id: number) {
    const saleCode = await saleCodeRepo.findOne({
        where: {
            id: id,
        },
    });
    if (!saleCode) {
        throw new BadRequest('Sale Code not found');
    }
    return saleCode;
}

export async function createSaleCode(createSaleCodeDTO: CreateSaleCodeDTO) {
    const { productIds, ...saleCode } = createSaleCodeDTO
    const newSaleCode = new SaleCode(saleCode);

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(newSaleCode);
        await transactionalEntityManager.update(Product, productIds, { saleCodeId: newSaleCode.id })
    })
    return newSaleCode;
}

export async function updateSaleCode(id: number, updateSaleCodeDTO: UpdateSaleCodeDTO) {
    const saleCode = await saleCodeRepo.findOneBy({
        id: id
    });

    if (!saleCode) {
        throw new BadRequest('Sale Code not found');
    }
    const { newProductIds, removeProductIds, ...updateSaleCode } = updateSaleCodeDTO;

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.update(SaleCode, id, updateSaleCode);
        if (newProductIds) {
            await transactionalEntityManager.update(Product, newProductIds, { saleCodeId: id })
        }
        if (removeProductIds) {
            await transactionalEntityManager.update(Product, removeProductIds, { saleCodeId: null })
        }
    })
    return saleCode;
}

export async function deleteSaleCode(id: number) {
    const saleCode = await saleCodeRepo.findOne({
        where: {
            id: id
        }
    });

    if (!saleCode) {
        throw new BadRequest('Sale code not found');
    }

    const products = await AppDataSource.getRepository(Product).find({
        where: {
            saleCodeId: id
        }
    });

    if (products.length !== 0) {
        throw new BadRequest('Sale code being used');
    }

    await saleCodeRepo.delete(id);
}
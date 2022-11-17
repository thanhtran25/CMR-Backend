import * as fs from "fs/promises";
import * as path from 'path';
import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { Product } from '../products/products.entity';
import { CreateProductDTO, UpdateProductDTO } from './products.dto';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';

const productRepo = AppDataSource.getRepository(Product);

export async function getProducts(filters: FilterPagination) {
    const query = buildPagination(Product, filters)
    const [result, total] = await productRepo.findAndCount({
        ...query,
        relations: {
            saleCode: true
        }
    });
    const products = result.map((product) => {
        let percent: number = 0;
        if (product.saleCode) {
            percent = product.saleCode.percent;
        }
        delete product.saleCode;
        return {
            ...product,
            percent
        }
    })
    return { totalPage: Math.ceil(total / filters.limit), products: products };
}

export async function getProduct(id: number) {
    const product = await productRepo.findOne({
        where: {
            id: id
        },
        relations: {
            saleCode: true
        }
    });
    if (!product) {
        throw new BadRequest('Product not found');
    }
    let percent: number = 0;
    if (product.saleCode) {
        percent = product.saleCode.percent;
    }
    delete product.saleCode;
    return { ...product, percent };
}

export async function createProduct(createProductDTO: CreateProductDTO) {
    const newProduct = new Product(createProductDTO);
    await productRepo.save(newProduct);
    return newProduct;
}

export async function updateProduct(id: number, updateProductDTO: UpdateProductDTO) {
    const product = await productRepo.findOneBy({
        id: id
    });

    if (!product) {
        throw new BadRequest('Product not found');
    }
    if (updateProductDTO.img1) {
        fs.unlink(path.join(__dirname, '../../public/product/image', product.img1)).catch(error => console.log(error))
        fs.unlink(path.join(__dirname, '../../public/product/image', product.img2)).catch(error => console.log(error))
    }

    await productRepo.update(id, updateProductDTO);
    return product;
}

export async function deleteProduct(id: number) {
    const product = await productRepo.findOneBy({
        id: id
    });

    if (!product) {
        throw new BadRequest('Product not found');
    }

    await productRepo.softDelete(id);
}

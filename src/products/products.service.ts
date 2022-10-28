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
    const products = await productRepo.find(query);
    return products;
}

export async function getProduct(id: number) {
    const product = await productRepo.findOneBy({
        id: id
    });
    if (!product) {
        throw new BadRequest('Product not found');
    }
    return product;
}

export async function createProduct(createProductDTO: CreateProductDTO) {
    const newProduct = new Product(createProductDTO);
    await productRepo.save(newProduct);
    return newProduct;
}

export async function updateProduct(id: number, updateProductDTO: UpdateProductDTO) {
    let product = await productRepo.findOneBy({
        id: id
    });

    if (!product) {
        throw new BadRequest('Product not found');
    }
    if (updateProductDTO.img1) {
        fs.unlink(path.join(__dirname, '../../public/product/image', product.img1)).catch(error => console.log(error))
        fs.unlink(path.join(__dirname, '../../public/product/image', product.img2)).catch(error => console.log(error))
    }
    product = {
        ...product,
        ...updateProductDTO,
    }
    await productRepo.update(id, product);

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

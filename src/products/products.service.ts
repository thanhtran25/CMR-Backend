import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { Product } from '../products/products.entity';
import { CreateProductDTO, FilterProductDTO, UpdateProductDTO } from './products.dto';
import { Like } from 'typeorm';
import { createInventory } from '../inventories/inventories.service';
import { CreateInventoryDTO } from '../inventories/inventories.dto';

const productRepo = AppDataSource.getRepository(Product);

export async function getProducts(pageNumber: number, pageSize: number, filter: FilterProductDTO) {
    const offset = pageSize * (pageNumber - 1);
    const limit = pageSize;
    let where: {
        name?: any;
        description?: any;
        brandId?: any;
        categoryId?: any;
        saleCodeId?: any;
    } = {};

    if (filter.name) {
        where.name = Like(`%${filter.name}%`);
    }
    if (filter.description) {
        where.description = Like(`%${filter.description}%`);
    }
    if (filter.brandId) {
        where.brandId = filter.brandId;
    }
    if (filter.categoryId) {
        where.categoryId = filter.categoryId;
    }
    if (filter.saleCodeId) {
        where.saleCodeId = filter.saleCodeId;
    }

    console.log(filter.order);

    let order: {
        price?: any
    } = {};

    if (filter.order) {
        order.price = filter.order;
    }

    const products = await productRepo.find({
        skip: offset,
        take: limit,
        where: where,
        order: order,
        relations: {
            inventory: true
        }
    });

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

export async function createProduct(createProductDTO: CreateProductDTO, amount: number) {
    const newProduct = new Product(createProductDTO);
    await productRepo.save(newProduct);
    await createInventory({ sold: 0, amount, productId: newProduct.id });
    return newProduct;
}

export async function updateProduct(id: number, updateProductDTO: UpdateProductDTO) {
    let product = await productRepo.findOneBy({
        id: id
    });

    if (!product) {
        throw new BadRequest('Product not found');
    }
    product = {
        ...product,
        ...updateProductDTO,
    }
    await productRepo.update(id, product);

    return product;
}

export async function deleteUser(id: number) {
    const product = await productRepo.findOneBy({
        id: id
    });

    if (!product) {
        throw new BadRequest('User not found');
    }

    await productRepo.softDelete(id);
}

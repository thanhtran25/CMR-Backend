import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateCategoryDTO, FilterCategory, UpdateCategoryDTO } from './categories.dto';
import { Like } from 'typeorm';
import { Category } from './categories.entity';

const categoryRepo = AppDataSource.getRepository(Category);

export async function getCategories(pageNumber: number, pageSize: number, filter: FilterCategory) {
    const offset = pageSize * (pageNumber - 1);
    const limit = pageSize;
    let where: {
        name?: any;
    } = {};

    if (filter.name) {
        where.name = Like(`%${filter.name}%`)
    }
    const categories = await categoryRepo.find({
        skip: offset,
        take: limit,
        where: where
    });

    return categories;
}

export async function getCategory(id: number) {
    const category = await categoryRepo.findOneBy({
        id: id
    });
    if (!category) {
        throw new BadRequest('Category not found');
    }
    return category;
}

export async function createCategory(createCategoryDTO: CreateCategoryDTO) {
    const duplicatedCategory = await categoryRepo.findOneBy({
        name: createCategoryDTO.name
    });
    if (duplicatedCategory) {
        throw new BadRequest('Category name already existed');
    }
    const newCategory = new Category(createCategoryDTO);

    await categoryRepo.save(newCategory);
    return newCategory;
}

export async function updateCategory(id: number, updateCategoryDTO: UpdateCategoryDTO) {
    let category = await categoryRepo.findOneBy({
        id: id
    });

    if (!category) {
        throw new BadRequest('Category not found');
    }
    category = {
        ...category,
        ...updateCategoryDTO,
    }
    await categoryRepo.update(id, category);
    return category;
}

export async function deleteCategory(id: number) {
    const category = await categoryRepo.findOneBy({
        id: id
    });

    if (!category) {
        throw new BadRequest('Category not found');
    }

    await categoryRepo.softDelete(id);
}
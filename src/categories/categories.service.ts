import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.dto';
import { Category } from './categories.entity';
import { buildPagination } from '../core/utils/paginantion.util';
import { FilterPagination } from '../core/interfaces/filter.interface';

const categoryRepo = AppDataSource.getRepository(Category);

export async function getCategories(filters: FilterPagination) {
    const query = buildPagination(Category, filters)
    const categories = await categoryRepo.find(query);
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
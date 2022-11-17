import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { CreateInventoryDTO, UpdateInventoryDTO } from './inventories.dto';
import { Inventory } from './inventories.entity';

const inventoryRepo = AppDataSource.getRepository(Inventory);

export async function getInventories(filters: FilterPagination) {
    const query = buildPagination(Inventory, filters)
    const [result, total] = await inventoryRepo.findAndCount(query);
    return { totalPage: Math.ceil(total / filters.limit), inventories: result };

}

export async function getInventory(id: number) {
    const inventory = await inventoryRepo.findOneBy({
        id: id
    });
    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    return inventory;
}

export async function createInventory(createInventoryDTO: CreateInventoryDTO) {

    const newInventory = new Inventory(createInventoryDTO);
    await inventoryRepo.save(newInventory);
    return newInventory;
}

export async function updateInventory(id: number, updateInventoryDTO: UpdateInventoryDTO) {
    const inventory = await inventoryRepo.findOneBy({
        id: id
    });

    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    await inventoryRepo.update(id, updateInventoryDTO);
    return inventory;
}

export async function deleteInventory(id: number) {
    const inventory = await inventoryRepo.findOneBy({
        id: id
    });

    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }

    await inventoryRepo.softDelete(id);
}
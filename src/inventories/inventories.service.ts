import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { CreateInventoryDTO, UpdateInventoryDTO } from './inventories.dto';
import { Inventory } from './inventories.entity';

const inventoryRepo = AppDataSource.getRepository(Inventory);

export async function getInventories(filters: FilterPagination) {
    const query = buildPagination(Inventory, filters)
    const users = await inventoryRepo.find(query);
    return users;
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
    let inventory = await inventoryRepo.findOneBy({
        id: id
    });

    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    inventory = {
        ...inventory,
        ...updateInventoryDTO
    }
    await inventoryRepo.update(id, inventory);
    return inventory;
}
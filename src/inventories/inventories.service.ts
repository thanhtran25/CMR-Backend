import { BadRequest } from 'http-errors';
import { AppDataSource } from '../core/database';
import { CreateInventoryDTO, UpdateInventoryDTO } from './inventories.dto';
import { Inventory } from './inventories.entity';

const inventoryRepo = AppDataSource.getRepository(Inventory);

export async function getInventories(pageNumber: number, pageSize: number) {
    const offset = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const inventories = await inventoryRepo.find({
        skip: offset,
        take: limit,
    });

    return inventories;
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
    inventory.sold += updateInventoryDTO.sold;
    inventory.amount -= updateInventoryDTO.sold;
    await inventoryRepo.update(id, inventory);
    return inventory;
}
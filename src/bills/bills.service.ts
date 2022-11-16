import { BadRequest } from 'http-errors';
import { In } from 'typeorm';
import { BillDetail } from '../bill_details/bill_details.entity';
import { AppDataSource } from '../core/database';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { ProductsInventories } from '../products_inventories/products_inventories.entity';
import { CreateBillDTO, UpdateBillDTO } from './bills.dto';
import { Bill } from './bills.entity';


const purchaseOrderRepo = AppDataSource.getRepository(Bill);
const productsInventoriesRepo = AppDataSource.getRepository(ProductsInventories);

export async function getBills(filters: FilterPagination) {
    const query = buildPagination(Bill, filters);
    console.log(query);

    const [result, total] = await purchaseOrderRepo.findAndCount({
        ...query,
        relations: {
            billDetails: {
                product: true
            }
        }
    });
    return { totalPage: total, bills: result };
}

export async function getBill(id: number) {
    const bill = await purchaseOrderRepo.findOne({
        where: {
            id: id,
        },
        relations: {
            billDetails: {
                product: true
            }
        }
    });
    if (!bill) {
        throw new BadRequest('Bill not found');
    }
    return bill;
}

export async function createBill(createPurchaseOrderDTO: CreateBillDTO) {
    const { details, ...bill } = createPurchaseOrderDTO
    const newBill = new Bill(bill);

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const createdBill = await transactionalEntityManager.save(newBill);

        const billDetails: Partial<BillDetail>[] = details.map(detail => ({
            ...detail,
            billId: createdBill.id,
        }));

        const newDetails = AppDataSource.getRepository(BillDetail).create(billDetails);
        await transactionalEntityManager.insert(BillDetail, newDetails);
    })
    return newBill;
}

export async function updateBill(createPurchaseOrderDTO: UpdateBillDTO) {

}
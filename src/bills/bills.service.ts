import { BadRequest } from 'http-errors';
import * as path from "path";
import { In } from 'typeorm';
import { BillDetail } from '../bill_details/bill_details.entity';
import { AppDataSource } from '../core/database';
import { BillStatus, OrderStates } from '../core/enum';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { sendEmail } from '../core/utils/send-email.util';
import { ProductsInventories } from '../products_inventories/products_inventories.entity';
import { User } from '../users/users.entity';
import { CreateBillDTO, UpdateBillDTO } from './bills.dto';
import { Bill } from './bills.entity';


const billRepo = AppDataSource.getRepository(Bill);
const productsInventoriesRepo = AppDataSource.getRepository(ProductsInventories);

export async function getBills(filters: FilterPagination) {
    const query = buildPagination(Bill, filters);
    console.log(query);

    const [result, total] = await billRepo.findAndCount({
        ...query,
        relations: {
            billDetails: {
                product: true
            }
        }
    });
    return { totalPage: Math.ceil(total / filters.limit), bills: result };
}

export async function getBill(id: number) {
    const bill = await billRepo.findOne({
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

export async function createBill(createBillDTO: CreateBillDTO) {
    const { details, ...bill } = createBillDTO
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

export async function updateBill(id: number, updateBillDTO: UpdateBillDTO) {
    const bill = await billRepo.findOne({
        where: {
            id: id,
        },
        relations: {
            billDetails: true
        }
    })

    if (!bill) {
        throw new BadRequest('Bill not found');
    }

    if (updateBillDTO.states === OrderStates.DELIVERED) {
        updateBillDTO.status = BillStatus.PAID;
    }

    const currentStates = statesMessage[updateBillDTO.states];
    const imageStates = `http://localhost:1912/static/states/${updateBillDTO.states}.png`
    const billInfo = billInformation(bill);

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Bill, id, updateBillDTO);

        const productsInventories = await getProductInventory(updateBillDTO.states, bill);
        console.log(productsInventories);

        if (productsInventories) {
            await transactionalEntityManager.save(productsInventories);
        }

        if (bill.userId) {
            const user = await transactionalEntityManager.findOne(User, {
                where: {
                    id: bill.userId
                },
            });

            sendEmail({
                email: user.email,
                subject: "Goldduck Camera - Trạng Thái Đơn Hàng",
                template: 'order-states',
                context: { currentStates, imageStates, billInfo }
            }).catch(error => console.log(error));
        }
    })

}

export async function getHistory(userId: number, limit: number, page: number) {
    const skip = limit * (page - 1);

    const [result, total] = await billRepo.findAndCount({
        where: {
            userId: userId,
        },
        skip: skip,
        take: limit,
        relations: {
            billDetails: {
                product: true
            }
        }
    });
    return { totalPage: Math.ceil(total / limit), bills: result };
}

async function getProductInventory(states: string, bill: Bill) {
    console.log(bill, states);

    const productIds = bill.billDetails.map((detail) => detail.productId);

    const productsInventories = await productsInventoriesRepo.find({
        where: {
            productId: In(productIds),
            inventoryId: 1
        }
    });

    if (states === OrderStates.SHIPPING) {
        productsInventories.forEach(productInventory => {
            bill.billDetails.forEach(detail => {
                if (detail.productId == +productInventory.productId) {
                    productInventory.amount -= detail.count;
                    productInventory.sold += detail.count;
                }
            })
        });
        return productsInventories;
    }

    if (states === OrderStates.CANCEL && bill.states != OrderStates.WAITING) {
        console.log(bill.states);

        productsInventories.forEach(productInventory => {
            bill.billDetails.forEach(detail => {
                if (detail.productId == +productInventory.productId) {
                    productInventory.amount += detail.count;
                    productInventory.sold -= detail.count;
                }
            })
        });
        return productsInventories;
    }

    return null;
}

const statesMessage = {
    'waiting': 'Đơn hàng đang chờ xác nhận',
    'shipping': 'Đơn hàng đã giao cho đơn vị vận chuyển',
    'delivering': 'Đơn hàng đang giao đến bạn',
    'delivered': 'Đơn hàng đã được nhận',
    'cancel': 'Đơn hàng đã bị hủy'
}

function billInformation(bill: Bill) {
    return `Địa chỉ nhận hàng: 
    ${bill.customerName}, 
    (+84)${bill.numberPhone.slice(1)}, 
    ${bill.address}.`
}
import { BadRequest } from 'http-errors';
import axios from 'axios';
import * as FormData from 'form-data';
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
import { Inventory } from '../inventories/inventories.entity';


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

export async function acceptBill(id: number, updateBillDTO: any) {
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

    if (states === OrderStates.CANCEL && bill.states != OrderStates.WAITING && bill.states != OrderStates.ACCEPTED) {
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
    'accepted': 'Đơn hàng đã được xác nhận',
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

export async function getCoordinates(address: string) {
    const data = new FormData();
    data.append('locate', address);
    data.append('geoit', 'JSON');
    data.append('region', 'VN');
    data.append('ok', 'Geocode');

    const config = {
        method: 'post',
        url: 'https://geocode.xyz/',
        headers: {
            ...data.getHeaders()
        },
        data: data
    };

    const { longt, latt } = await (await axios(config)).data;
    return { longt, latt };
}

export async function getShippingFee(address: string) {
    const inventories = await AppDataSource.getRepository(Inventory).findOne({
        where: {
            id: 1
        }
    });
    const coordinates = await Promise.all([getCoordinates(address), getCoordinates(inventories.address)]);

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(coordinates[0].latt - coordinates[1].latt);  // deg2rad below
    const dLon = deg2rad(coordinates[0].longt - coordinates[1].longt);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coordinates[0].latt)) * Math.cos(deg2rad(coordinates[1].latt)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = Math.round(R * c * 100) / 100; // Distance in km
    const shipping = calculateShippingFee(d);
    return { distance: d, shippingFee: shipping };
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

function calculateShippingFee(distance: number) {
    if (distance <= 5) {
        return 15000;
    }
    if (distance <= 20) {
        return (distance + 10) * 1000;
    }
    return 40000;
}
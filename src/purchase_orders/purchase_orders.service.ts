import { BadRequest } from 'http-errors';
import { In } from 'typeorm';
import { AppDataSource } from '../core/database';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { ProductsInventories } from '../products_inventories/products_inventories.entity';
import { PurchaseOrderDetail } from '../purchase_order_detail/purchase_order_detail.entity';
import { CreatePurchaseOrderDTO } from './purchase_orders.dto';
import { PurchaseOrder } from './purchase_orders.entity';


const purchaseOrderRepo = AppDataSource.getRepository(PurchaseOrder);
const productsInventoriesRepo = AppDataSource.getRepository(ProductsInventories);

export async function getPurchaseOrders(filters: FilterPagination) {
    const query = buildPagination(PurchaseOrder, filters);
    console.log(query);

    const [result, total] = await purchaseOrderRepo.findAndCount({
        ...query,
        relations: {
            purchaseOrderDetails: {
                product: true
            }
        }
    });
    return { totalPage: Math.ceil(total / filters.limit), purchaseOrders: result };
}

export async function getPurchaseOrder(id: number) {
    const purchaseOrder = await purchaseOrderRepo.findOne({
        where: {
            id: id,
        },
        relations: {
            purchaseOrderDetails: {
                product: true
            }
        }
    });
    if (!purchaseOrder) {
        throw new BadRequest('Purchase Order not found');
    }
    return purchaseOrder;
}

export async function createPurchaseOrder(createPurchaseOrderDTO: CreatePurchaseOrderDTO) {
    const { inventoryId, details, ...purchaseOrder } = createPurchaseOrderDTO
    const newPurchaseOrder = new PurchaseOrder(purchaseOrder);
    const productIds = details.map((detail) => detail.productId);

    const existedProductsInventories = await productsInventoriesRepo.find({
        where: {
            productId: In(productIds),
            inventoryId
        }
    })

    existedProductsInventories.forEach(productInventory => {
        details.forEach(detail => {
            if (detail.productId == +productInventory.productId) {
                productInventory.amount += detail.count;
            }
        })
    });

    const exitedProductIds = existedProductsInventories.map((productInventory) => +productInventory.productId);

    const notExistedProductsInventories = details.filter(detail => {
        return !exitedProductIds.includes(detail.productId);
    });

    const productsInventories: Partial<ProductsInventories>[] = notExistedProductsInventories.map(productsInventory => ({
        amount: productsInventory.count,
        inventoryId,
        productId: productsInventory.productId
    }))

    const newProductInventories = productsInventoriesRepo.create(productsInventories);

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const createdPurchaseOrder = await transactionalEntityManager.save(newPurchaseOrder);

        await transactionalEntityManager.save(existedProductsInventories);
        await transactionalEntityManager.insert(ProductsInventories, newProductInventories);

        const purchaseOrderDetails: Partial<PurchaseOrderDetail>[] = details.map(detail => ({
            ...detail,
            purchaseOrderId: createdPurchaseOrder.id,
        }));

        const newDetails = AppDataSource.getRepository(PurchaseOrderDetail).create(purchaseOrderDetails);
        await transactionalEntityManager.insert(PurchaseOrderDetail, newDetails);
    })
    return newPurchaseOrder;
}
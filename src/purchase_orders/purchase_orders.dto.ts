export class PurchaseOrderDetailDTO {
    count: number;
    price: number;
    productId: number;
}

export class CreatePurchaseOrderDTO {
    supplierId: number;
    staffId: number;
    inventoryId: number;
    details: PurchaseOrderDetailDTO[];
}
export class PurchaseOrderDetailDTO {
    count: number;
    price: number;
    productId: number;
}

export class createPurchaseOrderDTO {
    supplierId: number;
    staffId: number;
    inventoryId: number;
    details: PurchaseOrderDetailDTO[];
}
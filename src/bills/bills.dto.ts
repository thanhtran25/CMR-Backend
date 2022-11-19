import { BillStatus, OrderStates } from "../core/enum";

export class BillDetailDTO {
    count: number;
    price: number;
    productId: number;
}

export class CreateBillDTO {
    userId: number;
    customerName: string;
    address: string;
    numberPhone: string;
    states: OrderStates;
    status: BillStatus;
    details: BillDetailDTO[];
}

export class UpdateBillDTO {
    states: OrderStates;
    status: BillStatus;
}

export class ShippingDTO {
    states: OrderStates;
    status: BillStatus;
    shipperId: number;
}
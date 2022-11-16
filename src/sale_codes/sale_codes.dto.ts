
export class CreateSaleCodeDTO {
    productIds: number[];
    name: string;
    percent: number;
    startDate: Date;
    endDate: Date;
}

export class UpdateSaleCodeDTO {
    newProductIds: number[];
    removeProductIds: number[];
    name: string;
    percent: number;
    startDate: Date;
    endDate: Date;
}
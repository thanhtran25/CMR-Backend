
export class CreateProductDTO {
    name: string;
    price: number;
    img1: string;
    img2: string;
    description: string;
    brandId: number;
    categoryId: number;
    saleCodeId?: number;
}

export class UpdateProductDTO {
    name: string;
    price: number;
    img1: string;
    img2: string;
    description: string;
    brandId: number;
    categoryId: number;
    saleCodeId?: number;
}

export class FilterProductDTO {
    name: string;
    order: string;
    description: string;
    brandId: number;
    categoryId: number;
    saleCodeId: number;
}

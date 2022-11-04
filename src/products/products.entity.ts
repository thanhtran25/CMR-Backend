import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
    Relation

} from 'typeorm';
import { BillDetail } from '../bill_details/bill_details.entity';
import { Brand } from '../brands/brands.entity';
import { Category } from '../categories/categories.entity';
import { ProductsInventories } from '../products_inventories/products_inventories.entity';
import { PurchaseOrderDetail } from '../purchase_order_detail/purchase_order_detail.entity';
import { SaleCode } from '../sale_codes/sale_codes.entity';

@Entity('products')
export class Product {
    constructor(data: Partial<Product>) {
        Object.assign(this, data)
    }

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({
        length: 255
    })
    name: string;

    @Column()
    price: number;

    @Column()
    img1: string;

    @Column()
    img2: string;

    @Column()
    description: string;

    @Column()
    warrantyPeriod: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Relation<Brand>;
    @Column()
    brandId: number;

    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Relation<Category>;
    @Column()
    categoryId: number;

    @ManyToOne(() => SaleCode, (saleCode) => saleCode.products,)
    @JoinColumn({ name: 'sale_code_id' })
    saleCode: Relation<SaleCode>;
    @Column({ nullable: true })
    saleCodeId: number;

    @OneToMany(() => ProductsInventories, (productsInventories) => productsInventories.product)
    productsInventories: Relation<ProductsInventories>[];

    @OneToMany(() => BillDetail, (billDetail) => billDetail.product)
    billDetails: Relation<BillDetail>[];

    @OneToMany(() => PurchaseOrderDetail, (purchaseOrderDetail) => purchaseOrderDetail.product)
    purchaseOrderDetails: Relation<PurchaseOrderDetail>[];
}
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
import { Inventory } from '../inventories/inventories.entity';
import { ProductDetail } from '../product_detail/product_detail.entity';
import { PurchaseOrderDetail } from '../purchase_order_detail/purchase_order_detail.entity';
import { SaleCode } from '../sale_codes/sale_codes.entity';

@Entity('products')
export class Product {
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Relation<Brand>;

    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Relation<Category>;

    @ManyToOne(() => SaleCode, (saleCode) => saleCode.products, { nullable: false })
    @JoinColumn({ name: 'sale_code_id' })
    saleCode: Relation<SaleCode>;

    @OneToOne(() => Inventory, (inventory) => inventory.product, { nullable: false })
    @JoinColumn({
        name: 'inventory_id'
    })
    inventory: Relation<Inventory>;

    @OneToMany(() => BillDetail, (billDetail) => billDetail.product)
    billDetails: Relation<BillDetail>[];

    @OneToMany(() => PurchaseOrderDetail, (purchaseOderDetail) => purchaseOderDetail.product)
    purchaseOrderDetails: Relation<PurchaseOrderDetail>[];

    @OneToMany(() => ProductDetail, (productDetail) => productDetail.product)
    productDetails: Relation<ProductDetail>[];
}
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation
} from 'typeorm';
import { Product } from '../products/products.entity';
import { PurchaseOrder } from '../purchase_orders/purchase_orders.entity';

@Entity('purchase_order_details')
export class PurchaseOrderDetail {
    constructor(data: Partial<PurchaseOrderDetail>) {
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id!: number;

    @Column()
    count!: number;

    @Column()
    price!: number;

    @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.purchaseOrderDetails, { nullable: false })
    @JoinColumn()
    purchaseOrder!: Relation<PurchaseOrder>;

    @Column()
    purchaseOrderId: number

    @ManyToOne(() => Product, (product) => product.purchaseOrderDetails, { nullable: false })
    @JoinColumn()
    product!: Relation<Product>;

    @Column()
    productId: number;
}
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
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id!: number;

    @Column()
    count!: number;

    @Column()
    price!: number;

    @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.purchaseOrderDetails, { nullable: false })
    @JoinColumn({
        name: 'purchase_order_id',
    })
    purchaseOrder!: Relation<PurchaseOrder>;

    @ManyToOne(() => Product, (product) => product.purchaseOrderDetails, { nullable: false })
    @JoinColumn({
        name: 'product_id',
    })
    product!: Relation<Product>;
}
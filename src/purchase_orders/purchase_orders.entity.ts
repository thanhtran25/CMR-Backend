import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    Relation,
    OneToMany,
} from 'typeorm';
import { PurchaseOrderDetail } from '../purchase_order_detail/purchase_order_detail.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { User } from '../users/users.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders, { nullable: false })
    @JoinColumn({
        name: 'supplier_id'
    })
    supplier: Relation<Supplier>;

    @ManyToOne(() => User, (user) => user.purchaseOrders, { nullable: false })
    @JoinColumn({
        name: 'staff_id'
    })
    staff: Relation<User>;

    @OneToMany(() => PurchaseOrderDetail, (purchaseOderDetail) => purchaseOderDetail.product)
    purchaseOrderDetails: Relation<PurchaseOrderDetail>[];
}
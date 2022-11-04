import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    Relation,
    OneToMany,
    Column,
} from 'typeorm';
import { PurchaseOrderDetail } from '../purchase_order_detail/purchase_order_detail.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { User } from '../users/users.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
    constructor(data: Partial<PurchaseOrder>) {
        Object.assign(this, data);
    }

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
    @JoinColumn()
    supplier: Relation<Supplier>;

    @Column()
    supplierId: number;

    @ManyToOne(() => User, (user) => user.purchaseOrders, { nullable: false })
    @JoinColumn()
    staff: Relation<User>;

    @Column()
    staffId: number;

    @OneToMany(() => PurchaseOrderDetail, (purchaseOrderDetail) => purchaseOrderDetail.purchaseOrder)
    purchaseOrderDetails: Relation<PurchaseOrderDetail>[];
}
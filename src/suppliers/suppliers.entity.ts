import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Relation
} from 'typeorm';
import { PurchaseOrder } from '../purchase_orders/purchase_orders.entity';

@Entity('suppliers')
export class Supplier {
    constructor(data: Partial<Supplier>) {
        Object.assign(this, data)
    }

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    numberPhone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.supplier)
    purchaseOrders: Relation<PurchaseOrder>[];
}
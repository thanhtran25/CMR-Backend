import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Relation,
} from 'typeorm';
import { Bill } from '../bills/bills.entity';

import {
    Roles,
    Gender
} from '../core/enum';
import { Insurance } from '../insurances/insurances.entity';
import { PurchaseOrder } from '../purchase_orders/purchase_orders.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    email: string;

    @Column()
    hashedPassword: string;

    @Column()
    fullname: string;

    @Column({ nullable: true })
    birthday: Date;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.MALE,
        nullable: false
    })
    gender: Gender;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    numberPhone: number;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.CUSTOMER
    })
    role: Roles;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Relation<Bill>[];

    @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.staff)
    purchaseOrders: Relation<PurchaseOrder>[];

    @OneToMany(() => Insurance, (insurance) => insurance.user)
    insurances: Relation<Insurance>[];
}
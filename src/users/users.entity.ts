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
import { Token } from '../auth/token.entity';
import { Bill } from '../bills/bills.entity';

import {
    Roles,
    Gender
} from '../core/enum';
import { PurchaseOrder } from '../purchase_orders/purchase_orders.entity';

@Entity('users')
export class User {
    constructor(data: Partial<User>) {
        Object.assign(this, data)
    }


    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    email: string;

    @Column({ select: false })
    hashedPassword: string;

    @Column()
    fullname: string;

    @Column({ nullable: true, type: 'date' })
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
    numberPhone: string;

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

    @OneToMany(() => Token, (token) => token.user)
    tokens: Relation<Token>[];
}
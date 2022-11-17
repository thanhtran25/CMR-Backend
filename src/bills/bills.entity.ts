import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Relation,
    ManyToOne,
    JoinColumn,

} from 'typeorm';
import { BillDetail } from '../bill_details/bill_details.entity';
import { BillStatus, OrderStates } from '../core/enum';
import { User } from '../users/users.entity';

@Entity('bills')
export class Bill {
    constructor(data: Partial<Bill>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({
        name: 'customer_name'
    })
    customerName: string;

    @Column()
    address: string;

    @Column({
        name: 'number_phone',
        length: 11
    })
    numberPhone: string;

    @Column({
        type: 'enum',
        enum: OrderStates,
        default: OrderStates.WAITING,
    })
    states: OrderStates;

    @Column({
        type: 'enum',
        enum: BillStatus,
        default: BillStatus.UNPAID
    })
    status: BillStatus;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.bills)
    @JoinColumn()
    user: Relation<User>;

    @Column({ nullable: true })
    userId: number;

    @OneToMany(() => BillDetail, (billDetail) => billDetail.bill, { nullable: false })
    billDetails: Relation<BillDetail>[];
} 
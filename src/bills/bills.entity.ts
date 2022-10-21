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
    OneToOne,

} from 'typeorm';
import { BillDetail } from '../bill_details/bill_details.entity';
import { BillStatus, OrderStates } from '../core/enum';
import { User } from '../users/users.entity';

@Entity('bills')
export class Bill {
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
    })
    numberPhone: number;

    @Column({
        type: 'enum',
        enum: OrderStates,
        default: OrderStates.WAITING,
    })
    states: OrderStates;

    @Column({
        default: false
    })
    seen: boolean;

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
    @JoinColumn({
        name: 'user_id'
    })
    user: User;

    @OneToMany(() => BillDetail, (billDetail) => billDetail.bill, { nullable: false })
    billDetails: Relation<BillDetail>[];
} 
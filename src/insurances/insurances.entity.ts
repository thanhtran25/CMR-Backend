import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { ProductDetail } from '../product_detail/product_detail.entity';
import { User } from '../users/users.entity';

@Entity('insurances')
export class Insurance {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({
        name: 'warranty_time',
    })
    warrantyTime: number;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.insurances)
    @JoinColumn({
        name: 'user_id'
    })
    user: User;

    @OneToOne(() => ProductDetail, (productDetail) => productDetail.insurance, { nullable: false })
    @JoinColumn({
        name: 'product_detail_id'
    })
    productDetail: ProductDetail;
}
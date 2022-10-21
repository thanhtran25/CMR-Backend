import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Insurance } from '../insurances/insurances.entity';
import { Product } from '../products/products.entity';

@Entity('product_details')
export class ProductDetail {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    priority: number;

    @Column({
        name: 'cost_price'
    })
    costPrice: number;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.productDetails, { nullable: false })
    @JoinColumn({
        name: 'product_id'
    })
    product: Product;

    @OneToOne(() => Insurance, (insurance) => insurance.productDetail)
    insurance: Insurance;
}
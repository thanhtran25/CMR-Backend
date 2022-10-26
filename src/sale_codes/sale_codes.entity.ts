import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Relation,
} from 'typeorm';
import { Product } from '../products/products.entity';

@Entity('sale_codes')
export class SaleCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    percent: number;

    @Column({
        name: 'start_date',
    })
    startDate: Date;

    @Column({
        name: 'end_date',
    })
    endDate: Date;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Relation<Product>[];
}
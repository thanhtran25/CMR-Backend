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
    constructor(data: Partial<SaleCode>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    percent: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Relation<Product>[];
}
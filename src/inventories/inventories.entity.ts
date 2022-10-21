import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    Relation,

} from 'typeorm';
import { Product } from '../products/products.entity';

@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    sold: number;

    @Column()
    amount: number;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @OneToOne(() => Product, (product) => product.inventory)
    product: Relation<Product>;
} 
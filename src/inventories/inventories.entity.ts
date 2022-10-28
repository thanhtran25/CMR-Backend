import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    Relation,
    JoinColumn,
    DeleteDateColumn,

} from 'typeorm';
import { Product } from '../products/products.entity';
import { ProductsInventories } from '../products_inventories/products_inventories.entity';

@Entity('inventories')
export class Inventory {
    constructor(data: Partial<Inventory>) {
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

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @OneToOne(() => ProductsInventories, (productsInventories) => productsInventories.inventory)
    productsInventories: Relation<ProductsInventories>[];
} 
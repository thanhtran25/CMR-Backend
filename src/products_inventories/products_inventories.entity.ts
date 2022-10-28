
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Relation,
    JoinColumn,
    ManyToOne,

} from 'typeorm';
import { Inventory } from '../inventories/inventories.entity';
import { Product } from '../products/products.entity';

@Entity('products_inventories')
export class ProductsInventories {
    constructor(data: Partial<ProductsInventories>) {
        Object.assign(this, data)
    }

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    sold: number;

    @Column()
    amount: number;

    @ManyToOne(() => Product, (product) => product.productsInventories)
    @JoinColumn()
    product: Relation<Product>;

    @ManyToOne(() => Inventory, (inventory) => inventory.productsInventories)
    @JoinColumn()
    inventory: Inventory
} 
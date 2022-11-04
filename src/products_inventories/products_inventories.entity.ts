
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Relation,
    JoinColumn,
    ManyToOne,
    Unique,

} from 'typeorm';
import { Inventory } from '../inventories/inventories.entity';
import { Product } from '../products/products.entity';

@Entity('products_inventories')
@Unique(["productId", "inventoryId"])
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

    @ManyToOne(() => Product, (product) => product.productsInventories, { nullable: false })
    @JoinColumn()
    product: Relation<Product>;

    @Column()
    productId: number;

    @ManyToOne(() => Inventory, (inventory) => inventory.productsInventories, { nullable: false })
    @JoinColumn()
    inventory: Inventory

    @Column()
    inventoryId: number;
} 
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    Relation
} from 'typeorm';
import { Bill } from '../bills/bills.entity';
import { Product } from '../products/products.entity';

@Entity('bill_details')
export class BillDetail {

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id!: number;

    @Column()
    count!: number;

    @Column()
    price!: number;

    @ManyToOne(() => Bill, (bill) => bill.billDetails, { nullable: false })
    @JoinColumn()
    bill!: Relation<Bill>;

    @Column()
    billId: number;

    @ManyToOne(() => Product, (product) => product.billDetails, { nullable: false })
    @JoinColumn()
    product!: Relation<Product>;

    @Column()
    productId: number;
}
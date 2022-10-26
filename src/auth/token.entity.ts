import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Relation,
    ManyToOne,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('tokens')
export class Token {
    constructor(data: Partial<Token>) {
        Object.assign(this, data)
    }

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    token: string;

    @Column()
    expiredAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    user: Relation<User>;
}
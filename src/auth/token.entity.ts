import { TokenType } from '../core/enum';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Relation,
    ManyToOne,
    JoinColumn,
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

    @Column({
        type: 'enum',
        enum: TokenType
    })
    type: TokenType;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    user: Relation<User>;

    @Column({ nullable: true })
    userId: number;
}
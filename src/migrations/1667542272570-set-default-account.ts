import * as dotenv from "dotenv";
dotenv.config();
import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from "typeorm";
import { ROUNDS_NUMBER } from '../core/constant'


export class setDefaultAccount1667542272570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash(process.env.ACCOUNT_PASSWORD, ROUNDS_NUMBER);
        await queryRunner.query(`
            INSERT INTO \`users\`(\`email\`, \`hashed_password\`, \`fullname\`, \`role\`) 
            VALUES ('${process.env.ACCOUNT_EMAIL}','${hashedPassword}','${process.env.ACCOUNT_FULLNAME}','${process.env.ACCOUNT_ROLE}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`users\` WHERE email = '${process.env.ACCOUNT_EMAIL}'
        `);
    }

}

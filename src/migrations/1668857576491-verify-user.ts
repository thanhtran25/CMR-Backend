import { MigrationInterface, QueryRunner } from "typeorm";

export class verifyUser1668857576491 implements MigrationInterface {
    name = 'verifyUser1668857576491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`verify\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`tokens\`
            ADD \`type\` enum ('forgot_password', 'signup') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum (
                    'admin',
                    'manager',
                    'staff',
                    'customer',
                    'shipper'
                ) NOT NULL DEFAULT 'customer'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'manager', 'staff', 'customer') NOT NULL DEFAULT 'customer'
        `);
        await queryRunner.query(`
            ALTER TABLE \`tokens\` DROP COLUMN \`type\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`verify\`
        `);
    }

}

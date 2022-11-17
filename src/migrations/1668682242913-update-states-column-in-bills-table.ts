import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStatesColumnInBillsTable1668682242913 implements MigrationInterface {
    name = 'updateStatesColumnInBillsTable1668682242913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`states\` \`states\` enum (
                    'waiting',
                    'shipping',
                    'delivering',
                    'delivered',
                    'cancel'
                ) NOT NULL DEFAULT 'waiting'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`states\` \`states\` enum (
                    'watting',
                    'shipping',
                    'delivering',
                    'delivered',
                    'cancel'
                ) NOT NULL DEFAULT 'watting'
        `);
    }

}

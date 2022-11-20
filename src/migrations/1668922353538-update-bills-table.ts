import { MigrationInterface, QueryRunner } from "typeorm";

export class updateBillsTable1668922353538 implements MigrationInterface {
    name = 'updateBillsTable1668922353538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`shipping_fee\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`shipping_fee\`
        `);
    }

}

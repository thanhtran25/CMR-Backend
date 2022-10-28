import { MigrationInterface, QueryRunner } from "typeorm";

export class softDeleteInventories1666981097971 implements MigrationInterface {
    name = 'softDeleteInventories1666981097971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`deleted_at\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`deleted_at\`
        `);
    }

}

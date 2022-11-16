import { MigrationInterface, QueryRunner } from "typeorm";

export class updateBillsTable1668616838839 implements MigrationInterface {
    name = 'updateBillsTable1668616838839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`seen\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`number_phone\` varchar(11) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`number_phone\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`seen\` tinyint NOT NULL DEFAULT 0
        `);
    }

}

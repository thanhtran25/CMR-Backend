import { MigrationInterface, QueryRunner } from "typeorm";

export class supplierPhoneNumber1667281453644 implements MigrationInterface {
    name = 'supplierPhoneNumber1667281453644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`suppliers\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`suppliers\`
            ADD \`number_phone\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`suppliers\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`suppliers\`
            ADD \`number_phone\` int NOT NULL
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserTable1666463754645 implements MigrationInterface {
    name = 'updateUserTable1666463754645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`birthday\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`birthday\` date NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`number_phone\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`number_phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`number_phone\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`birthday\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`birthday\` datetime NULL
        `);
    }

}

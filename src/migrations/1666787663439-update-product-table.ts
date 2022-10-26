import { MigrationInterface, QueryRunner } from "typeorm";

export class updateProductTable1666787663439 implements MigrationInterface {
    name = 'updateProductTable1666787663439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_aa9e091921d70e8bae149585a9c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`sale_code_id\` \`sale_code_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_aa9e091921d70e8bae149585a9c\` FOREIGN KEY (\`sale_code_id\`) REFERENCES \`sale_codes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_aa9e091921d70e8bae149585a9c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`sale_code_id\` \`sale_code_id\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_aa9e091921d70e8bae149585a9c\` FOREIGN KEY (\`sale_code_id\`) REFERENCES \`sale_codes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}

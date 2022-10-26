import { MigrationInterface, QueryRunner } from "typeorm";

export class inventory1666798268430 implements MigrationInterface {
    name = 'inventory1666798268430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_92fc0c77bab4a656b9619322c6\` ON \`inventories\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_92fc0c77bab4a656b9619322c62\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` CHANGE \`product_id\` \`product_id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD CONSTRAINT \`FK_92fc0c77bab4a656b9619322c62\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_92fc0c77bab4a656b9619322c62\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` CHANGE \`product_id\` \`product_id\` bigint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD CONSTRAINT \`FK_92fc0c77bab4a656b9619322c62\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_92fc0c77bab4a656b9619322c6\` ON \`inventories\` (\`product_id\`)
        `);
    }

}

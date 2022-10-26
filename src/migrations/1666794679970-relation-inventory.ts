import { MigrationInterface, QueryRunner } from "typeorm";

export class relationInventory1666794679970 implements MigrationInterface {
    name = 'relationInventory1666794679970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_834b52ac77bc55fc5d0eb014ae2\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` ON \`products\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`inventory_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`product_id\` bigint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD UNIQUE INDEX \`IDX_92fc0c77bab4a656b9619322c6\` (\`product_id\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_92fc0c77bab4a656b9619322c6\` ON \`inventories\` (\`product_id\`)
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
            DROP INDEX \`REL_92fc0c77bab4a656b9619322c6\` ON \`inventories\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP INDEX \`IDX_92fc0c77bab4a656b9619322c6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`product_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`inventory_id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` ON \`products\` (\`inventory_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_834b52ac77bc55fc5d0eb014ae2\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}

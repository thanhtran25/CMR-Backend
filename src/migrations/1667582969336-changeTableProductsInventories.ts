import { MigrationInterface, QueryRunner } from "typeorm";

export class changeTableProductsInventories1667582969336 implements MigrationInterface {
    name = 'changeTableProductsInventories1667582969336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_00a81319a4c68dfed29f705de6a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_05dc4cb3d226a1f04e251ac97b5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` CHANGE \`product_id\` \`product_id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` CHANGE \`inventory_id\` \`inventory_id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_5362041bf98bb248fbb99dcd09\` ON \`products_inventories\` (\`product_id\`, \`inventory_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_00a81319a4c68dfed29f705de6a\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_05dc4cb3d226a1f04e251ac97b5\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_05dc4cb3d226a1f04e251ac97b5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_00a81319a4c68dfed29f705de6a\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_5362041bf98bb248fbb99dcd09\` ON \`products_inventories\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` CHANGE \`inventory_id\` \`inventory_id\` bigint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` CHANGE \`product_id\` \`product_id\` bigint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_05dc4cb3d226a1f04e251ac97b5\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_00a81319a4c68dfed29f705de6a\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}

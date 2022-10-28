import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTables1666975165832 implements MigrationInterface {
    name = 'updateTables1666975165832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`insurances\` DROP FOREIGN KEY \`FK_8d0f4b41b939f0641fbbd032e3b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`insurances\` DROP FOREIGN KEY \`FK_9f34d0399e84f7dde8044ce6f2d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_details\` DROP FOREIGN KEY \`FK_abbb591b1989c63fb0c240dfffb\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_8d0f4b41b939f0641fbbd032e3\` ON \`insurances\`
        `);
        await queryRunner.query(`
            DROP TABLE \`insurances\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_details\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_92fc0c77bab4a656b9619322c62\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_92fc0c77bab4a656b9619322c6\` ON \`inventories\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`products_inventories\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`sold\` int NOT NULL,
                \`amount\` int NOT NULL,
                \`product_id\` bigint NULL,
                \`inventory_id\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`brands\` DROP COLUMN \`hele\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`product_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`amount\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`sold\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`name\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`address\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`warranty_period\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_aa9e091921d70e8bae149585a9c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_00a81319a4c68dfed29f705de6a\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\`
            ADD CONSTRAINT \`FK_05dc4cb3d226a1f04e251ac97b5\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_05dc4cb3d226a1f04e251ac97b5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products_inventories\` DROP FOREIGN KEY \`FK_00a81319a4c68dfed29f705de6a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_aa9e091921d70e8bae149585a9c\` FOREIGN KEY (\`sale_code_id\`) REFERENCES \`sale_codes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`warranty_period\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`address\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\` DROP COLUMN \`name\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`sold\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`amount\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD \`product_id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`brands\`
            ADD \`hele\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE \`products_inventories\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_92fc0c77bab4a656b9619322c6\` ON \`inventories\` (\`product_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`inventories\`
            ADD CONSTRAINT \`FK_92fc0c77bab4a656b9619322c62\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_details\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`priority\` int NOT NULL,
                \`cost_price\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`product_id\` bigint NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`insurances\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`warranty_time\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` bigint NULL,
                \`product_detail_id\` bigint NOT NULL,
                UNIQUE INDEX \`REL_8d0f4b41b939f0641fbbd032e3\` (\`product_detail_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_details\`
            ADD CONSTRAINT \`FK_abbb591b1989c63fb0c240dfffb\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`insurances\`
            ADD CONSTRAINT \`FK_9f34d0399e84f7dde8044ce6f2d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`insurances\`
            ADD CONSTRAINT \`FK_8d0f4b41b939f0641fbbd032e3b\` FOREIGN KEY (\`product_detail_id\`) REFERENCES \`product_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}

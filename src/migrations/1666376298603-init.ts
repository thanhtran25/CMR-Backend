import { MigrationInterface, QueryRunner } from "typeorm";

export class init1666376298603 implements MigrationInterface {
    name = 'init1666376298603'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TABLE \`purchase_order_details\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`count\` int NOT NULL,
                \`price\` int NOT NULL,
                \`purchase_order_id\` bigint NOT NULL,
                \`product_id\` bigint NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`suppliers\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`address\` varchar(255) NOT NULL,
                \`number_phone\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`purchase_orders\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`supplier_id\` bigint NOT NULL,
                \`staff_id\` bigint NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`hashed_password\` varchar(255) NOT NULL,
                \`fullname\` varchar(255) NOT NULL,
                \`birthday\` datetime NULL,
                \`gender\` enum ('male', 'female', 'other') NOT NULL DEFAULT 'male',
                \`address\` varchar(255) NULL,
                \`number_phone\` int NULL,
                \`role\` enum ('admin', 'manager', 'staff', 'customer') NOT NULL DEFAULT 'customer',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`bills\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`customer_name\` varchar(255) NOT NULL,
                \`address\` varchar(255) NOT NULL,
                \`number_phone\` int NOT NULL,
                \`states\` enum ('watting', 'shipping', 'delivering', 'delivered') NOT NULL DEFAULT 'watting',
                \`seen\` tinyint NOT NULL DEFAULT 0,
                \`status\` enum ('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`bill_details\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`count\` int NOT NULL,
                \`price\` int NOT NULL,
                \`bill_id\` bigint NOT NULL,
                \`product_id\` bigint NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`categories\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`inventories\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`sold\` int NOT NULL,
                \`amount\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`sale_codes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`percent\` int NOT NULL,
                \`start_date\` datetime NOT NULL,
                \`end_date\` datetime NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`price\` int NOT NULL,
                \`img1\` varchar(255) NOT NULL,
                \`img2\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`brand_id\` bigint NOT NULL,
                \`category_id\` bigint NOT NULL,
                \`sale_code_id\` int NOT NULL,
                \`inventory_id\` bigint NOT NULL,
                UNIQUE INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` (\`inventory_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`brands\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`hele\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
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
        await queryRunner.query(`
            ALTER TABLE \`purchase_order_details\`
            ADD CONSTRAINT \`FK_08f0d16ed60b199a4973097255d\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_order_details\`
            ADD CONSTRAINT \`FK_d3b4369887dd815c0b52023ddca\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_orders\`
            ADD CONSTRAINT \`FK_d16a885aa88447ccfd010e739b0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_orders\`
            ADD CONSTRAINT \`FK_829f6eb6943af50356a86593169\` FOREIGN KEY (\`staff_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_03e3fcf1580c70bb68aedb999bf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bill_details\`
            ADD CONSTRAINT \`FK_6f20b1d0b535a7d38c7d73fabea\` FOREIGN KEY (\`bill_id\`) REFERENCES \`bills\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bill_details\`
            ADD CONSTRAINT \`FK_643701a9f93c4d1453361baa6a3\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_1530a6f15d3c79d1b70be98f2be\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_aa9e091921d70e8bae149585a9c\` FOREIGN KEY (\`sale_code_id\`) REFERENCES \`sale_codes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_834b52ac77bc55fc5d0eb014ae2\` FOREIGN KEY (\`inventory_id\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_834b52ac77bc55fc5d0eb014ae2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_aa9e091921d70e8bae149585a9c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1530a6f15d3c79d1b70be98f2be\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bill_details\` DROP FOREIGN KEY \`FK_643701a9f93c4d1453361baa6a3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bill_details\` DROP FOREIGN KEY \`FK_6f20b1d0b535a7d38c7d73fabea\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_03e3fcf1580c70bb68aedb999bf\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_829f6eb6943af50356a86593169\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_d16a885aa88447ccfd010e739b0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_d3b4369887dd815c0b52023ddca\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_08f0d16ed60b199a4973097255d\`
        `);
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
            DROP TABLE \`brands\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_834b52ac77bc55fc5d0eb014ae\` ON \`products\`
        `);
        await queryRunner.query(`
            DROP TABLE \`products\`
        `);
        await queryRunner.query(`
            DROP TABLE \`sale_codes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`inventories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`categories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`bill_details\`
        `);
        await queryRunner.query(`
            DROP TABLE \`bills\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`purchase_orders\`
        `);
        await queryRunner.query(`
            DROP TABLE \`suppliers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`purchase_order_details\`
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
    }

}

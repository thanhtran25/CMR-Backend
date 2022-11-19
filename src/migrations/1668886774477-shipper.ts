import { MigrationInterface, QueryRunner } from "typeorm";

export class shipper1668886774477 implements MigrationInterface {
    name = 'shipper1668886774477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`shipper_id\` bigint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`states\` \`states\` enum (
                    'waiting',
                    'accepted',
                    'shipping',
                    'delivering',
                    'delivered',
                    'cancel'
                ) NOT NULL DEFAULT 'waiting'
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_2ef2d32a243fef765d176ed2bcc\` FOREIGN KEY (\`shipper_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_2ef2d32a243fef765d176ed2bcc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`states\` \`states\` enum (
                    'waiting',
                    'shipping',
                    'delivering',
                    'delivered',
                    'cancel'
                ) NOT NULL DEFAULT 'waiting'
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`shipper_id\`
        `);
    }

}

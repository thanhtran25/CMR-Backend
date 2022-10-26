import { MigrationInterface, QueryRunner } from "typeorm";

export class token1666777110464 implements MigrationInterface {
    name = 'token1666777110464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`tokens\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`token\` varchar(255) NOT NULL,
                \`expired_at\` datetime NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`user_id\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`tokens\`
            ADD CONSTRAINT \`FK_8769073e38c365f315426554ca5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_8769073e38c365f315426554ca5\`
        `);
        await queryRunner.query(`
            DROP TABLE \`tokens\`
        `);
    }

}

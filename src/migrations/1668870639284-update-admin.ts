import { MigrationInterface, QueryRunner } from "typeorm"

export class updateAdmin1668870639284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE \`users\` SET \`verify\`= true WHERE \`email\` = '${process.env.ACCOUNT_EMAIL}'
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE \`users\` SET \`verify\`= false WHERE \`email\` = '${process.env.ACCOUNT_EMAIL}'
        `);
    }
}

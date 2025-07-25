import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753467879887 implements MigrationInterface {
    name = 'Migration1753467879887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "watch_status" SET DEFAULT 'NONE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753467916582 implements MigrationInterface {
    name = 'Migration1753467916582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" SET DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" SET DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "watch_status" SET DEFAULT 'NONE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`);
    }

}

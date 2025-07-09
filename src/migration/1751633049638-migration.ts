import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751633049638 implements MigrationInterface {
    name = 'Migration1751633049638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "tmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series" ADD "tmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season" ADD "tmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" ADD "tmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "release_status" SET DEFAULT 'FINISHED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "release_status" SET DEFAULT 'NOT_RELEASED'`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" DROP COLUMN "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "series_season" DROP COLUMN "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "tmdbId"`);
    }

}

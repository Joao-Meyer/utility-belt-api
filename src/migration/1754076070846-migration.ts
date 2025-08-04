import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754076070846 implements MigrationInterface {
  name = 'Migration1754076070846';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_in"`
    );
    await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "rank" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "rank" SET DEFAULT '0'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "season_progress_series_season_user_id_unique_index" ON "user_series_season_progress" ("user_id", "series_season_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_user_id_unique_index" ON "user_series_episode_watched" ("user_id", "series_season_episode_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_index" ON "user_series_episode_watched" ("user_series_season_progress_id", "series_season_episode_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_index"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_user_id_unique_index"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."season_progress_series_season_user_id_unique_index"`
    );
    await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "rank" SET DEFAULT '-1'`);
    await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "rank" SET DEFAULT '-1'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_in" ON "user_series_episode_watched" ("series_season_episode_id", "user_series_season_progress_id") `
    );
  }
}

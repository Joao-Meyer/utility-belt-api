import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753963347020 implements MigrationInterface {
  name = 'Migration1753963347020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_in"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ADD "total_season_watched" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_index" ON "user_series_episode_watched" ("user_series_season_progress_id", "series_season_episode_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_index"`
    );
    await queryRunner.query(`ALTER TABLE "user_series" DROP COLUMN "total_season_watched"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_in" ON "user_series_episode_watched" ("series_season_episode_id", "user_series_season_progress_id") `
    );
  }
}

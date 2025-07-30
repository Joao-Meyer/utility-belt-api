import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753904293952 implements MigrationInterface {
  name = 'Migration1753904293952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "season_progress_series_season_user_series_unique_index" ON "user_series_season_progress" ("series_season_id", "user_series_id") `
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
      `DROP INDEX "public"."season_progress_series_season_user_series_unique_index"`
    );
  }
}

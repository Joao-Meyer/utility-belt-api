import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754344043020 implements MigrationInterface {
  name = 'Migration1754344043020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_in"`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_series_season_episode_number_unique_index" ON "series_season_episode" ("episode_number", "series_season_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_index" ON "user_series_episode_watched" ("user_series_season_progress_id", "series_season_episode_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "season_series_season_number_unique_index" ON "series_season" ("season_number", "series_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."season_series_season_number_unique_index"`);
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_index"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."episode_series_season_episode_number_unique_index"`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_in" ON "user_series_episode_watched" ("series_season_episode_id", "user_series_season_progress_id") `
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Trigger1753979467208 implements MigrationInterface {
  name = 'Trigger1753979467208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_in"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ADD "user_id" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ADD "user_id" integer NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_index" ON "user_series_episode_watched" ("user_series_season_progress_id", "series_season_episode_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ADD CONSTRAINT "FK_b28a7b953a5a42e26563c0dff77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ADD CONSTRAINT "FK_f183322b0fe8a2e252df42e61e7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" DROP CONSTRAINT "FK_f183322b0fe8a2e252df42e61e7"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" DROP CONSTRAINT "FK_b28a7b953a5a42e26563c0dff77"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."episode_watched_series_season_episode_season_progress_unique_index"`
    );
    await queryRunner.query(`ALTER TABLE "user_series_season_progress" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "user_series_episode_watched" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "episode_watched_series_season_episode_season_progress_unique_in" ON "user_series_episode_watched" ("series_season_episode_id", "user_series_season_progress_id") `
    );
  }
}

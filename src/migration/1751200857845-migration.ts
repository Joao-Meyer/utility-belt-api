import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751200857845 implements MigrationInterface {
  name = 'Migration1751200857845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "theme" ADD "youtube_id" text`);
    await queryRunner.query(
      `CREATE TYPE "public"."edit_history_type_enum" AS ENUM('INSERT', 'EDIT', 'REMOVE')`
    );
    await queryRunner.query(
      `ALTER TABLE "edit_history" ADD "type" "public"."edit_history_type_enum" NOT NULL`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_watch_status_enum" RENAME TO "user_series_watch_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER', 'NONE')`
    );
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "watch_status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "user_series" ALTER COLUMN "watch_status" TYPE "public"."user_series_watch_status_enum" USING "watch_status"::"text"::"public"."user_series_watch_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_series_watch_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_season_progress_watch_status_enum" RENAME TO "user_series_season_progress_watch_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_season_progress_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER', 'NONE')`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" TYPE "public"."user_series_season_progress_watch_status_enum" USING "watch_status"::"text"::"public"."user_series_season_progress_watch_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_series_season_progress_watch_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_episode_watched_watch_status_enum" RENAME TO "user_series_episode_watched_watch_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_episode_watched_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER', 'NONE')`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" TYPE "public"."user_series_episode_watched_watch_status_enum" USING "watch_status"::"text"::"public"."user_series_episode_watched_watch_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_series_episode_watched_watch_status_enum_old"`
    );
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "youtube_music_url"`);
    await queryRunner.query(`ALTER TABLE "theme" ADD "youtube_music_url" text`);
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "spotify_url"`);
    await queryRunner.query(`ALTER TABLE "theme" ADD "spotify_url" text`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_movie_watch_status_enum" RENAME TO "user_movie_watch_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_movie_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER', 'NONE')`
    );
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "watch_status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "user_movie" ALTER COLUMN "watch_status" TYPE "public"."user_movie_watch_status_enum" USING "watch_status"::"text"::"public"."user_movie_watch_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_movie_watch_status_enum_old"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_user_movie_unique_index" ON "user_movie" ("user_id", "movie_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_user_movie_unique_index"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_movie_watch_status_enum_old" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "watch_status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "user_movie" ALTER COLUMN "watch_status" TYPE "public"."user_movie_watch_status_enum_old" USING "watch_status"::"text"::"public"."user_movie_watch_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_movie_watch_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_movie_watch_status_enum_old" RENAME TO "user_movie_watch_status_enum"`
    );
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "spotify_url"`);
    await queryRunner.query(`ALTER TABLE "theme" ADD "spotify_url" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "youtube_music_url"`);
    await queryRunner.query(`ALTER TABLE "theme" ADD "youtube_music_url" character varying(255)`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_episode_watched_watch_status_enum_old" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" TYPE "public"."user_series_episode_watched_watch_status_enum_old" USING "watch_status"::"text"::"public"."user_series_episode_watched_watch_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_series_episode_watched_watch_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_episode_watched_watch_status_enum_old" RENAME TO "user_series_episode_watched_watch_status_enum"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_season_progress_watch_status_enum_old" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" TYPE "public"."user_series_season_progress_watch_status_enum_old" USING "watch_status"::"text"::"public"."user_series_season_progress_watch_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_series_season_progress_watch_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_season_progress_watch_status_enum_old" RENAME TO "user_series_season_progress_watch_status_enum"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_watch_status_enum_old" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "watch_status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "user_series" ALTER COLUMN "watch_status" TYPE "public"."user_series_watch_status_enum_old" USING "watch_status"::"text"::"public"."user_series_watch_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ALTER COLUMN "watch_status" SET DEFAULT 'NOT_STARTED'`
    );
    await queryRunner.query(`DROP TYPE "public"."user_series_watch_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_series_watch_status_enum_old" RENAME TO "user_series_watch_status_enum"`
    );
    await queryRunner.query(`ALTER TABLE "edit_history" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."edit_history_type_enum"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "youtube_id"`);
  }
}

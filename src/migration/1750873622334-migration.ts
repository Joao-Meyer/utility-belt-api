import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750873622334 implements MigrationInterface {
  name = 'Migration1750873622334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "series_category" ("id" SERIAL NOT NULL, "category_id" integer NOT NULL, "series_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4728b16bad86fda71f7113b621a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie_category" ("id" SERIAL NOT NULL, "category_id" integer NOT NULL, "movie_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "series_tag" ("id" SERIAL NOT NULL, "tag_id" integer NOT NULL, "series_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_25a3aa478ee820946c8cfbe6c9d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie_tag" ("id" SERIAL NOT NULL, "tag_id" integer NOT NULL, "movie_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ace4ae4e851edf830ee5fb133c6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_movie_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_movie" ("id" SERIAL NOT NULL, "favorite" boolean NOT NULL DEFAULT false, "watch_status" "public"."user_movie_watch_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "score" double precision NOT NULL DEFAULT '0', "movie_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2fe260b71a39352cfebb47ffa4a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_playlist" ("id" SERIAL NOT NULL, "isCollaborator" boolean NOT NULL, "playlist_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_49fd9ed8fc57feeb406c108a1df" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."playlist_visibility_enum" AS ENUM('PUBLIC', 'PRIVATE')`
    );
    await queryRunner.query(
      `CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "image_url" text NOT NULL, "visibility" "public"."playlist_visibility_enum" NOT NULL, "owner_id" integer NOT NULL, "parent_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_296eec80d3b2b33551489a0c21f" UNIQUE ("name"), CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_season_progress_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_series_season_progress" ("id" SERIAL NOT NULL, "watch_status" "public"."user_series_season_progress_watch_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "series_season_id" integer NOT NULL, "user_series_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_87e384c5032417277fc04cd5f7e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_episode_watched_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_series_episode_watched" ("id" SERIAL NOT NULL, "watch_status" "public"."user_series_episode_watched_watch_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "score" double precision NOT NULL DEFAULT '0', "series_season_episode_id" integer NOT NULL, "user_series_season_progress_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e28beb7fa61a575b4b75af976ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "series_season_episode" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "synopsis" text NOT NULL DEFAULT '', "episode_number" integer NOT NULL, "season_number" integer NOT NULL, "duration" double precision NOT NULL, "image_url" text NOT NULL, "aired_at" TIMESTAMP WITH TIME ZONE, "score" double precision NOT NULL DEFAULT '0', "scored_by" integer NOT NULL DEFAULT '0', "series_season_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8c4530389bb2543ee77d3934295" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."series_season_status_enum" AS ENUM('AIRING', 'COMPLETED', 'UPCOMING')`
    );
    await queryRunner.query(
      `CREATE TABLE "series_season" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "synopsis" text NOT NULL DEFAULT '', "image_url" text NOT NULL, "total_episodes" integer NOT NULL DEFAULT '12', "status" "public"."series_season_status_enum" NOT NULL DEFAULT 'COMPLETED', "season_number" integer NOT NULL, "aired_at" TIMESTAMP WITH TIME ZONE, "aired_end_at" TIMESTAMP WITH TIME ZONE, "series_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_859b0c89e5f5b20c09837e93d7d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."theme_type_enum" AS ENUM('OPENING', 'ENDING', 'MUSIC', 'VIDEO', 'TRAILER', 'OST')`
    );
    await queryRunner.query(
      `CREATE TABLE "theme" ("id" SERIAL NOT NULL, "title" text NOT NULL, "type" "public"."theme_type_enum" NOT NULL, "url" text, "youtube_url" text, "youtube_music_url" character varying(255), "spotify_url" character varying(255), "order" integer NOT NULL DEFAULT '1', "series_id" integer, "movie_id" integer, "playlist_id" integer, "series_season_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c1934d0b4403bf10c1ab0c18166" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "original_title" character varying(255) NOT NULL, "image_url" text NOT NULL, "duration" double precision NOT NULL, "homepage" text, "imdbId" character varying(100), "backdrop_image_url" text NOT NULL, "trailerUrl" text, "trailerYoutubeId" character varying(255), "synopsis" text NOT NULL DEFAULT '', "rank" integer NOT NULL DEFAULT '-1', "score" double precision NOT NULL DEFAULT '0', "scored_by" integer NOT NULL DEFAULT '0', "total_favorites" integer NOT NULL DEFAULT '0', "total_watch_list" integer NOT NULL DEFAULT '0', "aired_at" TIMESTAMP WITH TIME ZONE, "alternative_title_list" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "playlist_item" ("id" SERIAL NOT NULL, "order" integer NOT NULL DEFAULT '-1', "series_id" integer, "movie_id" integer, "playlist_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_958bd2e5a3e9728df21b5855dc9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."series_release_status_enum" AS ENUM('NOT_RELEASED', 'RELEASING', 'FINISHED', 'CANCELLED', 'HIATUS')`
    );
    await queryRunner.query(
      `CREATE TABLE "series" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "original_title" character varying(255) NOT NULL, "image_url" text NOT NULL, "homepage" text, "release_status" "public"."series_release_status_enum" NOT NULL DEFAULT 'NOT_RELEASED', "backdrop_image_url" text NOT NULL, "trailerUrl" text, "trailerYoutubeId" character varying(255), "synopsis" text NOT NULL DEFAULT '', "total_episodes" integer NOT NULL, "total_seasons" integer NOT NULL, "rank" integer NOT NULL DEFAULT '-1', "score" double precision NOT NULL DEFAULT '0', "scored_by" integer NOT NULL DEFAULT '0', "total_favorites" integer NOT NULL DEFAULT '0', "total_watch_list" integer NOT NULL DEFAULT '0', "aired_at" TIMESTAMP WITH TIME ZONE, "aired_end_at" TIMESTAMP WITH TIME ZONE, "alternative_title_list" text array NOT NULL, "imdbId" character varying(100), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_series_watch_status_enum" AS ENUM('NOT_STARTED', 'WATCHING', 'WATCHED', 'DROPPED', 'WATCH_LATER')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_series" ("id" SERIAL NOT NULL, "favorite" boolean NOT NULL DEFAULT false, "watch_status" "public"."user_series_watch_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "score" double precision NOT NULL DEFAULT '0', "series_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9d37825bc8bbc8ffe5fdd762802" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "edit_history" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "entity_type" character varying(100) NOT NULL, "entity_id" integer NOT NULL, "old_data" json, "new_data" json NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d5205110c72f360c7d10bd5ff03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "series_category" ADD CONSTRAINT "FK_748fa4d4a7a560b33929ee069a8" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "series_category" ADD CONSTRAINT "FK_75fd06694f763af56e9ad4be5da" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "FK_22bbd4d33dbc49b240df412d28e" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "FK_772fbff485e9541a9b4d7fec888" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "series_tag" ADD CONSTRAINT "FK_7c97163e59bf0604115daf23f35" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "series_tag" ADD CONSTRAINT "FK_d510c15f74698073bfec2b68570" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_tag" ADD CONSTRAINT "FK_02eaa80a7913b040feb6b41670a" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_tag" ADD CONSTRAINT "FK_af04851b483c962cf8b276b2fe1" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" ADD CONSTRAINT "FK_ac0c16fc2db8997aa7d98d35ae8" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" ADD CONSTRAINT "FK_11ad665c82121e4a8b9506f95cb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_playlist" ADD CONSTRAINT "FK_78c541724706e156ef0bd6ab7e1" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_playlist" ADD CONSTRAINT "FK_55f715ff39128c149b944cb66a3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist" ADD CONSTRAINT "FK_38b1adf33796cb0cd7845c250ba" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist" ADD CONSTRAINT "FK_a16d738c9aedef9c17ff0e53017" FOREIGN KEY ("parent_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ADD CONSTRAINT "FK_e5700058d059edbf33a944c6e1e" FOREIGN KEY ("series_season_id") REFERENCES "series_season"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" ADD CONSTRAINT "FK_b05a0943a75a1a0075a92760265" FOREIGN KEY ("user_series_id") REFERENCES "user_series"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ADD CONSTRAINT "FK_d0cbf415180a8936f5324a60665" FOREIGN KEY ("series_season_episode_id") REFERENCES "series_season_episode"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ADD CONSTRAINT "FK_12f3c2362210ddda651f619a500" FOREIGN KEY ("user_series_season_progress_id") REFERENCES "user_series_season_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "series_season_episode" ADD CONSTRAINT "FK_5e63905aaa06c831987cd275b18" FOREIGN KEY ("series_season_id") REFERENCES "series_season"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "series_season" ADD CONSTRAINT "FK_924bfaf0bc1b54adcde0522a675" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_06dbe5d14d969416c1e14eab70c" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_e5605a6e182ec5cbcf0889da027" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_5f55c82aa922631b87ad5008fbd" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_87a770be8cf7c4f9adece5860cc" FOREIGN KEY ("series_season_id") REFERENCES "series_season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" ADD CONSTRAINT "FK_b3a8d0c83f7f79feb0947871775" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" ADD CONSTRAINT "FK_ab58a361758de8b508d9afeb4cc" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" ADD CONSTRAINT "FK_4b1dcd6418e9bfafccdb3358828" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ADD CONSTRAINT "FK_cff346b0fe91c3d058897b34142" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ADD CONSTRAINT "FK_e93624b2eb04977093c37f54c52" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_series" DROP CONSTRAINT "FK_e93624b2eb04977093c37f54c52"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" DROP CONSTRAINT "FK_cff346b0fe91c3d058897b34142"`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" DROP CONSTRAINT "FK_4b1dcd6418e9bfafccdb3358828"`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" DROP CONSTRAINT "FK_ab58a361758de8b508d9afeb4cc"`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" DROP CONSTRAINT "FK_b3a8d0c83f7f79feb0947871775"`
    );
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_87a770be8cf7c4f9adece5860cc"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_5f55c82aa922631b87ad5008fbd"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_e5605a6e182ec5cbcf0889da027"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_06dbe5d14d969416c1e14eab70c"`);
    await queryRunner.query(
      `ALTER TABLE "series_season" DROP CONSTRAINT "FK_924bfaf0bc1b54adcde0522a675"`
    );
    await queryRunner.query(
      `ALTER TABLE "series_season_episode" DROP CONSTRAINT "FK_5e63905aaa06c831987cd275b18"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" DROP CONSTRAINT "FK_12f3c2362210ddda651f619a500"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" DROP CONSTRAINT "FK_d0cbf415180a8936f5324a60665"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" DROP CONSTRAINT "FK_b05a0943a75a1a0075a92760265"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_season_progress" DROP CONSTRAINT "FK_e5700058d059edbf33a944c6e1e"`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist" DROP CONSTRAINT "FK_a16d738c9aedef9c17ff0e53017"`
    );
    await queryRunner.query(
      `ALTER TABLE "playlist" DROP CONSTRAINT "FK_38b1adf33796cb0cd7845c250ba"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_playlist" DROP CONSTRAINT "FK_55f715ff39128c149b944cb66a3"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_playlist" DROP CONSTRAINT "FK_78c541724706e156ef0bd6ab7e1"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" DROP CONSTRAINT "FK_11ad665c82121e4a8b9506f95cb"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie" DROP CONSTRAINT "FK_ac0c16fc2db8997aa7d98d35ae8"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_tag" DROP CONSTRAINT "FK_af04851b483c962cf8b276b2fe1"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_tag" DROP CONSTRAINT "FK_02eaa80a7913b040feb6b41670a"`
    );
    await queryRunner.query(
      `ALTER TABLE "series_tag" DROP CONSTRAINT "FK_d510c15f74698073bfec2b68570"`
    );
    await queryRunner.query(
      `ALTER TABLE "series_tag" DROP CONSTRAINT "FK_7c97163e59bf0604115daf23f35"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "FK_772fbff485e9541a9b4d7fec888"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "FK_22bbd4d33dbc49b240df412d28e"`
    );
    await queryRunner.query(
      `ALTER TABLE "series_category" DROP CONSTRAINT "FK_75fd06694f763af56e9ad4be5da"`
    );
    await queryRunner.query(
      `ALTER TABLE "series_category" DROP CONSTRAINT "FK_748fa4d4a7a560b33929ee069a8"`
    );
    await queryRunner.query(`DROP TABLE "edit_history"`);
    await queryRunner.query(`DROP TABLE "user_series"`);
    await queryRunner.query(`DROP TYPE "public"."user_series_watch_status_enum"`);
    await queryRunner.query(`DROP TABLE "series"`);
    await queryRunner.query(`DROP TYPE "public"."series_release_status_enum"`);
    await queryRunner.query(`DROP TABLE "playlist_item"`);
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "theme"`);
    await queryRunner.query(`DROP TYPE "public"."theme_type_enum"`);
    await queryRunner.query(`DROP TABLE "series_season"`);
    await queryRunner.query(`DROP TYPE "public"."series_season_status_enum"`);
    await queryRunner.query(`DROP TABLE "series_season_episode"`);
    await queryRunner.query(`DROP TABLE "user_series_episode_watched"`);
    await queryRunner.query(`DROP TYPE "public"."user_series_episode_watched_watch_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_series_season_progress"`);
    await queryRunner.query(`DROP TYPE "public"."user_series_season_progress_watch_status_enum"`);
    await queryRunner.query(`DROP TABLE "playlist"`);
    await queryRunner.query(`DROP TYPE "public"."playlist_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "user_playlist"`);
    await queryRunner.query(`DROP TABLE "user_movie"`);
    await queryRunner.query(`DROP TYPE "public"."user_movie_watch_status_enum"`);
    await queryRunner.query(`DROP TABLE "movie_tag"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "series_tag"`);
    await queryRunner.query(`DROP TABLE "movie_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "series_category"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1753969600040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION update_user_series_when_all_seasons_watched()
      RETURNS TRIGGER AS $$
      DECLARE
        v_user_series_id INT;
        v_series_id INT;
        v_total_seasons INT;
        v_watched_seasons INT;
      BEGIN
        v_user_series_id := NEW.user_series_id;

        SELECT ss.series_id INTO v_series_id
        FROM series_season ss
        WHERE ss.id = NEW.series_season_id;

        SELECT COUNT(*) INTO v_total_seasons
        FROM series_season
        WHERE series_id = v_series_id;

        SELECT COUNT(*) INTO v_watched_seasons
        FROM user_series_season_progress usp
        JOIN series_season ss ON ss.id = usp.series_season_id
        WHERE usp.user_series_id = v_user_series_id
          AND ss.series_id = v_series_id
          AND usp.watch_status = 'WATCHED';

        IF v_watched_seasons = v_total_seasons THEN
          UPDATE user_series
          SET watch_status = 'WATCHED', total_season_watched = v_watched_seasons
          WHERE id = v_user_series_id;
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      `
    );

    await queryRunner.query(
      `
      CREATE TRIGGER trg_check_all_seasons_finished
      AFTER INSERT OR UPDATE ON user_series_season_progress
      FOR EACH ROW
      WHEN (NEW.watch_status = 'WATCHED')
      EXECUTE FUNCTION update_user_series_when_all_seasons_watched();
      `
    );

    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION update_season_progress_if_all_episodes_watched()
      RETURNS TRIGGER AS $$
      DECLARE
        v_season_id INT;
        v_user_progress_id INT;
        v_total_episodes INT;
        v_watched_episodes INT;
      BEGIN
        v_season_id := (
          SELECT series_season_id
          FROM series_season_episode
          WHERE id = NEW.series_season_episode_id
        );

        v_user_progress_id := NEW.user_series_season_progress_id;

        SELECT COUNT(*) INTO v_total_episodes
        FROM series_season_episode
        WHERE series_season_id = v_season_id;

        SELECT COUNT(*) INTO v_watched_episodes
        FROM user_series_episode_watched uwe
        JOIN series_season_episode sse ON sse.id = uwe.series_season_episode_id
        WHERE uwe.user_series_season_progress_id = v_user_progress_id
          AND sse.series_season_id = v_season_id
          AND uwe.watch_status = 'WATCHED';

        IF v_total_episodes > 0 AND v_watched_episodes = v_total_episodes THEN
          UPDATE user_series_season_progress
          SET watch_status = 'WATCHED'
          WHERE id = v_user_progress_id;
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      `
    );

    await queryRunner.query(
      `
      CREATE TRIGGER trg_check_all_episodes_watched
      AFTER INSERT OR UPDATE ON user_series_episode_watched
      FOR EACH ROW
      WHEN (NEW.watch_status = 'WATCHED')
      EXECUTE FUNCTION update_season_progress_if_all_episodes_watched();
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_check_all_seasons_finished ON user_series_season_progress`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_user_series_when_all_seasons_watched`);

    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_check_all_episodes_watched ON user_series_episode_watched`
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_season_progress_if_all_episodes_watched`
    );
  }
}

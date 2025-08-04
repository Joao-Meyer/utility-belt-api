import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1754047482233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_episode_score()
      RETURNS TRIGGER AS $$
      DECLARE
        episode_id INTEGER;
        new_score FLOAT;
      BEGIN
        episode_id := COALESCE(NEW.series_season_episode_id, OLD.series_season_episode_id);

        SELECT COALESCE(AVG(score), 0)
        INTO new_score
        FROM user_series_episode_watched
        WHERE series_season_episode_id = episode_id AND score IS NOT NULL;

        UPDATE series_season_episode
        SET
          score = new_score,
          scored_by = (
            SELECT COUNT(*) 
            FROM user_series_episode_watched 
            WHERE series_season_episode_id = episode_id AND score IS NOT NULL
          )
        WHERE id = episode_id;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_update_episode_score
      AFTER INSERT OR UPDATE OR DELETE ON user_series_episode_watched
      FOR EACH ROW
      EXECUTE FUNCTION update_episode_score();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_update_episode_score ON user_series_episode_watched`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_episode_score`);
  }
}

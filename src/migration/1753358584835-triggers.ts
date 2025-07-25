import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1753358584835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION recalculate_series_ranks()
      RETURNS VOID AS $$
      BEGIN
        WITH ranked_series AS (
          SELECT id, RANK() OVER (ORDER BY score DESC) AS new_rank
          FROM series
        )
        UPDATE series
        SET rank = ranked_series.new_rank
        FROM ranked_series
        WHERE series.id = ranked_series.id;
      END;
      $$ LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_series_stats()
      RETURNS TRIGGER AS $$
      DECLARE
        series_id_to_update INTEGER;
        old_score FLOAT;
        new_score FLOAT;
      BEGIN
        series_id_to_update := COALESCE(NEW.series_id, OLD.series_id);

        SELECT score INTO old_score FROM series WHERE id = series_id_to_update;

        SELECT 
          COALESCE(AVG(score), 0)
        INTO new_score
        FROM user_series
        WHERE series_id = series_id_to_update AND score IS NOT NULL;

        UPDATE series
        SET 
          total_favorites = (
            SELECT COUNT(*) 
            FROM user_series 
            WHERE series_id = series_id_to_update AND favorite = true
          ),
          total_watch_list = (
            SELECT COUNT(*) 
            FROM user_series 
            WHERE series_id = series_id_to_update AND watch_status != 'NONE'
          ),
          score = new_score,
          scored_by = (
            SELECT COUNT(*) 
            FROM user_series 
            WHERE series_id = series_id_to_update AND score IS NOT NULL
          )
        WHERE id = series_id_to_update;

        IF old_score IS DISTINCT FROM new_score THEN
          PERFORM recalculate_series_ranks();
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_update_series_stats
      AFTER INSERT OR UPDATE OR DELETE ON user_series
      FOR EACH ROW
      EXECUTE FUNCTION update_series_stats();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_series_stats ON user_series`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_series_stats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS recalculate_series_ranks`);
  }
}

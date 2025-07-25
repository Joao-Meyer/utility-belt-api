import { MigrationInterface, QueryRunner } from 'typeorm';

export class Trigger1751203559906 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION recalculate_movie_ranks()
      RETURNS VOID AS $$
      BEGIN
        WITH ranked_movies AS (
          SELECT id, RANK() OVER (ORDER BY score DESC) AS new_rank
          FROM movie
        )
        UPDATE movie
        SET rank = ranked_movies.new_rank
        FROM ranked_movies
        WHERE movie.id = ranked_movies.id;
      END;
      $$ LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_movie_stats()
      RETURNS TRIGGER AS $$
      DECLARE
        movie_id_to_update INTEGER;
        old_score FLOAT;
        new_score FLOAT;
      BEGIN
        movie_id_to_update := COALESCE(NEW.movie_id, OLD.movie_id);

        SELECT score INTO old_score FROM movie WHERE id = movie_id_to_update;

        SELECT 
          COALESCE(AVG(score), 0)
        INTO new_score
        FROM user_movie
        WHERE movie_id = movie_id_to_update AND score IS NOT NULL;

        UPDATE movie
        SET 
          total_favorites = (
            SELECT COUNT(*) 
            FROM user_movie 
            WHERE movie_id = movie_id_to_update AND favorite = true
          ),
          total_watch_list = (
            SELECT COUNT(*) 
            FROM user_movie 
            WHERE movie_id = movie_id_to_update AND watch_status != 'NONE'
          ),
          score = new_score,
          scored_by = (
            SELECT COUNT(*) 
            FROM user_movie 
            WHERE movie_id = movie_id_to_update AND score IS NOT NULL
          )
        WHERE id = movie_id_to_update;

        IF old_score IS DISTINCT FROM new_score THEN
          PERFORM recalculate_movie_ranks();
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_update_movie_stats
      AFTER INSERT OR UPDATE OR DELETE ON user_movie
      FOR EACH ROW
      EXECUTE FUNCTION update_movie_stats();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_movie_stats ON user_movie`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_movie_stats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS recalculate_movie_ranks`);
  }
}

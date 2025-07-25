import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1753357455155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION update_all_category_stats()
      RETURNS void AS $$
      BEGIN
        UPDATE category c
        SET 
          total_items = COALESCE(mc.count, 0) + COALESCE(sc.count, 0),
          items_rate = ROUND(COALESCE(mc.total_score, 0)::numeric + COALESCE(sc.total_score, 0)::numeric, 2)
        FROM (
          SELECT category_id, COUNT(*) as count, AVG(m.score) as total_score
          FROM movie_category mc
          JOIN movie m ON mc.movie_id = m.id
          GROUP BY category_id
        ) mc
        FULL OUTER JOIN (
          SELECT category_id, COUNT(*) as count, AVG(s.score) as total_score
          FROM series_category sc
          JOIN series s ON sc.series_id = s.id
          GROUP BY category_id
        ) sc ON mc.category_id = sc.category_id
        WHERE c.id = COALESCE(mc.category_id, sc.category_id);
      END;
      $$ LANGUAGE plpgsql;
        `
    );
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION trigger_update_all_category_stats()
      RETURNS trigger AS $$
      BEGIN
        PERFORM update_all_category_stats();
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
        `
    );

    await queryRunner.query(
      `CREATE TRIGGER trg_update_category_stats_movie
      AFTER INSERT OR DELETE ON movie_category
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_category_stats();
        `
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_update_category_stats_series
      AFTER INSERT OR DELETE ON series_category
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_category_stats();
        `
    );

    await queryRunner.query(
      `CREATE TRIGGER trg_update_category_stats_movie_2
      AFTER INSERT OR DELETE ON movie
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_category_stats();
        `
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_update_category_stats_series_2
      AFTER INSERT OR DELETE ON series
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_category_stats();
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_update_category_stats_movie ON movie_category`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_update_category_stats_series ON series_category`
    );
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_category_stats_movie_2 ON movie`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_category_stats_series_2 ON series`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_all_category_stats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trigger_update_all_category_stats`);
  }
}

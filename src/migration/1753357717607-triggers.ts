import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1753357717607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION update_all_tag_stats()
      RETURNS void AS $$
      BEGIN
        UPDATE tag c
        SET 
          total_items = COALESCE(mc.count, 0) + COALESCE(sc.count, 0),
          items_rate = ROUND(COALESCE(mc.total_score, 0)::numeric + COALESCE(sc.total_score, 0)::numeric, 2)
        FROM (
          SELECT tag_id, COUNT(*) as count, AVG(m.score) as total_score
          FROM movie_tag mc
          JOIN movie m ON mc.movie_id = m.id
          GROUP BY tag_id
        ) mc
        FULL OUTER JOIN (
          SELECT tag_id, COUNT(*) as count, AVG(s.score) as total_score
          FROM series_tag sc
          JOIN series s ON sc.series_id = s.id
          GROUP BY tag_id
        ) sc ON mc.tag_id = sc.tag_id
        WHERE c.id = COALESCE(mc.tag_id, sc.tag_id);
      END;
      $$ LANGUAGE plpgsql;
        `
    );
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION trigger_update_all_tag_stats()
      RETURNS trigger AS $$
      BEGIN
        PERFORM update_all_tag_stats();
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
        `
    );

    await queryRunner.query(
      `CREATE TRIGGER trg_update_tag_stats_movie
      AFTER INSERT OR DELETE ON movie_tag
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_tag_stats();
        `
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_update_tag_stats_series
      AFTER INSERT OR DELETE ON series_tag
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_tag_stats();
        `
    );

    await queryRunner.query(
      `CREATE TRIGGER trg_update_tag_stats_movie_2
      AFTER INSERT OR DELETE ON movie
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_tag_stats();
        `
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_update_tag_stats_series_2
      AFTER INSERT OR DELETE ON series
      FOR EACH ROW
      EXECUTE FUNCTION trigger_update_all_tag_stats();
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_tag_stats_movie ON movie_tag`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_tag_stats_series ON series_tag`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_tag_stats_movie_2 ON movie`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_tag_stats_series_2 ON series`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_all_tag_stats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trigger_update_all_tag_stats`);
  }
}

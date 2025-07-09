import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndex1751295199866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX playlist_item_movie_playlist_unique_key ON playlist_item (movie_id, playlist_id) WHERE movie_id IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX playlist_item_series_playlist_unique_key ON playlist_item (series_id, playlist_id) WHERE series_id IS NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS playlist_item_movie_playlist_unique_key`);
    await queryRunner.query(`DROP INDEX IF EXISTS playlist_item_series_playlist_unique_key`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751203538218 implements MigrationInterface {
  name = 'Migration1751203538218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "theme" DROP COLUMN "youtube_url"`);
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "score" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "score" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "score" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "score" DROP DEFAULT`
    );
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "score" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "score" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "score" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "user_movie" ALTER COLUMN "score" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "score" SET DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series_episode_watched" ALTER COLUMN "score" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "score" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "user_series" ALTER COLUMN "score" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "theme" ADD "youtube_url" text`);
  }
}

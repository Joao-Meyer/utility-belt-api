import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751980895096 implements MigrationInterface {
  name = 'Migration1751980895096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_movie" ADD "watch_status_order" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_series" ADD "watch_status_order" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_series" DROP COLUMN "watch_status_order"`);
    await queryRunner.query(`ALTER TABLE "user_movie" DROP COLUMN "watch_status_order"`);
  }
}

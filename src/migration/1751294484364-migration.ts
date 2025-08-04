import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751294484364 implements MigrationInterface {
  name = 'Migration1751294484364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_playlist" ADD "isOwner" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "playlist" ADD "order" integer NOT NULL DEFAULT '-1'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "playlist" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "user_playlist" DROP COLUMN "isOwner"`);
  }
}

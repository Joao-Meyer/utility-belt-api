import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753357444119 implements MigrationInterface {
  name = 'Migration1753357444119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "total_items" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD "items_rate" double precision NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(`ALTER TABLE "tag" ADD "total_items" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "items_rate" double precision NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "items_rate"`);
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "total_items"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "items_rate"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "total_items"`);
  }
}

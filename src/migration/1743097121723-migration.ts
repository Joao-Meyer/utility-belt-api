import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743097121723 implements MigrationInterface {
  name = 'Migration1743097121723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_day_user_day_key" ON "user_day" ("day", "user_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_day_user_day_key"`);
  }
}

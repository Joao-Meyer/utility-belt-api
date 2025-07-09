import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742493231293 implements MigrationInterface {
  name = 'Migration1742493231293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_quest_day_user_quest_key" ON "user_quest" ("day", "quest_id", "user_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_quest_day_user_quest_key"`);
  }
}

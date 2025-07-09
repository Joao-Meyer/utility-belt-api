import { MigrationInterface, QueryRunner } from 'typeorm';

export class Trigger1742558309746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION check_user_day_insert()
      RETURNS TRIGGER AS $$
      DECLARE
        total_quests INT;
        completed_quests INT;
      BEGIN
        SELECT COUNT(*) INTO total_quests
        FROM quest
        WHERE "count_to_day" = true
          AND "finished_at" IS NULL;

        SELECT COUNT(*) INTO completed_quests
        FROM user_quest
        WHERE "user_id" = NEW."user_id"
          AND "day" = NEW."day"
          AND "quest_id" IN (
            SELECT id FROM quest WHERE "count_to_day" = true AND "finished_at" IS NULL
          );

        IF completed_quests = total_quests AND total_quests > 0 THEN
          INSERT INTO user_day("day", "user_id")
          VALUES (NEW."day", NEW."user_id")
          ON CONFLICT DO NOTHING;
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      `
    );
    await queryRunner.query(
      `
        CREATE TRIGGER user_quest_insert_trigger
        AFTER INSERT ON user_quest
        FOR EACH ROW
        EXECUTE FUNCTION check_user_day_insert();
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('');
  }
}

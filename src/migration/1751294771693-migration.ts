import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751294771693 implements MigrationInterface {
  name = 'Migration1751294771693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_playlist" DROP COLUMN "isCollaborator"`);
    await queryRunner.query(`ALTER TABLE "user_playlist" DROP COLUMN "isOwner"`);
    await queryRunner.query(`ALTER TABLE "user_playlist" ADD "is_collaborator" boolean NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_playlist" ADD "is_owner" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_playlist" DROP COLUMN "is_owner"`);
    await queryRunner.query(`ALTER TABLE "user_playlist" DROP COLUMN "is_collaborator"`);
    await queryRunner.query(
      `ALTER TABLE "user_playlist" ADD "isOwner" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "user_playlist" ADD "isCollaborator" boolean NOT NULL`);
  }
}

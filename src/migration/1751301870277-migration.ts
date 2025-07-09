import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751301870277 implements MigrationInterface {
    name = 'Migration1751301870277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_playlist" ALTER COLUMN "is_collaborator" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_playlist" ALTER COLUMN "is_collaborator" DROP DEFAULT`);
    }

}

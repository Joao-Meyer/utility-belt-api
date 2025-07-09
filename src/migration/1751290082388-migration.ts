import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751290082388 implements MigrationInterface {
    name = 'Migration1751290082388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist" ALTER COLUMN "image_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist" ALTER COLUMN "image_url" SET NOT NULL`);
    }

}

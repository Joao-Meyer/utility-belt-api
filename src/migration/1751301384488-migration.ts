import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751301384488 implements MigrationInterface {
    name = 'Migration1751301384488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "user_playlist_unique_index" ON "user_playlist" ("user_id", "playlist_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_user_series_unique_index" ON "user_series" ("user_id", "series_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."user_user_series_unique_index"`);
        await queryRunner.query(`DROP INDEX "public"."user_playlist_unique_index"`);
    }

}

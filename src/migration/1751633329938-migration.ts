import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751633329938 implements MigrationInterface {
    name = 'Migration1751633329938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346" UNIQUE ("tmdbId")`);
        await queryRunner.query(`ALTER TABLE "series" ADD CONSTRAINT "UQ_a45d0b46da5afd904af2f7b2b40" UNIQUE ("tmdbId")`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" ADD CONSTRAINT "UQ_6d6b6b854efbaeb1e19d5d9023d" UNIQUE ("tmdbId")`);
        await queryRunner.query(`ALTER TABLE "series_season" ADD CONSTRAINT "UQ_2cdc3a55ee2d80e7703b7049bc0" UNIQUE ("tmdbId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "series_season" DROP CONSTRAINT "UQ_2cdc3a55ee2d80e7703b7049bc0"`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" DROP CONSTRAINT "UQ_6d6b6b854efbaeb1e19d5d9023d"`);
        await queryRunner.query(`ALTER TABLE "series" DROP CONSTRAINT "UQ_a45d0b46da5afd904af2f7b2b40"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751636114622 implements MigrationInterface {
    name = 'Migration1751636114622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "tmdbId" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "movie" RENAME CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346" TO "UQ_22cb43bb628a84676ad3a4c2a91"`);
        await queryRunner.query(`ALTER TABLE "series" RENAME COLUMN "tmdbId" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "series" RENAME CONSTRAINT "UQ_a45d0b46da5afd904af2f7b2b40" TO "UQ_232377490587487bb7ab63e0c8e"`);
        await queryRunner.query(`ALTER TABLE "series_season" RENAME COLUMN "tmdbId" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "series_season" RENAME CONSTRAINT "UQ_2cdc3a55ee2d80e7703b7049bc0" TO "UQ_642bfd1f9cdbda99a7e0d3f0960"`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" RENAME COLUMN "tmdbId" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" RENAME CONSTRAINT "UQ_6d6b6b854efbaeb1e19d5d9023d" TO "UQ_216930c58e1afc95517f04e98d9"`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "tmdb_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "tmdb_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season" ALTER COLUMN "tmdb_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" ALTER COLUMN "tmdb_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "series_season_episode" ALTER COLUMN "tmdb_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season" ALTER COLUMN "tmdb_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series" ALTER COLUMN "tmdb_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "tmdb_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" RENAME CONSTRAINT "UQ_216930c58e1afc95517f04e98d9" TO "UQ_6d6b6b854efbaeb1e19d5d9023d"`);
        await queryRunner.query(`ALTER TABLE "series_season_episode" RENAME COLUMN "tmdb_id" TO "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "series_season" RENAME CONSTRAINT "UQ_642bfd1f9cdbda99a7e0d3f0960" TO "UQ_2cdc3a55ee2d80e7703b7049bc0"`);
        await queryRunner.query(`ALTER TABLE "series_season" RENAME COLUMN "tmdb_id" TO "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "series" RENAME CONSTRAINT "UQ_232377490587487bb7ab63e0c8e" TO "UQ_a45d0b46da5afd904af2f7b2b40"`);
        await queryRunner.query(`ALTER TABLE "series" RENAME COLUMN "tmdb_id" TO "tmdbId"`);
        await queryRunner.query(`ALTER TABLE "movie" RENAME CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" TO "UQ_e67ea82f6973f5b9a6747fba346"`);
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "tmdb_id" TO "tmdbId"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742475928555 implements MigrationInterface {
    name = 'Migration1742475928555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest" ADD "countToDay" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest" DROP COLUMN "countToDay"`);
    }

}

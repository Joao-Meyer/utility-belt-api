import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742472790044 implements MigrationInterface {
    name = 'Migration1742472790044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_day" ("id" SERIAL NOT NULL, "day" date NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_adb88f8278a6a600abc7003eff3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "user_day" ADD CONSTRAINT "FK_a31b90302b7fd667e406a42dfab" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_day" DROP CONSTRAINT "FK_a31b90302b7fd667e406a42dfab"`);
        await queryRunner.query(`ALTER TABLE "quest" DROP COLUMN "order"`);
        await queryRunner.query(`DROP TABLE "user_day"`);
    }

}

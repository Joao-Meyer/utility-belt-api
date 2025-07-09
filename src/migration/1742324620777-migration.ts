import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742324620777 implements MigrationInterface {
    name = 'Migration1742324620777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_quest" ("id" SERIAL NOT NULL, "day" date NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "quest_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_61a721810ddb65d863c65687e8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "url" text NOT NULL, "user_personal_quest_id" integer, "user_quest_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_personal_quest" ("id" SERIAL NOT NULL, "day" date NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "personal_quest_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4e8a0e0559c0cd8bc946bdae1ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "personal_quest" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_da056c59eacd599f6192ab8aed5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" text NOT NULL, "name" character varying(255) NOT NULL, "avatar_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_username_key" ON "user" ("username") `);
        await queryRunner.query(`CREATE TABLE "quest" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "created_by_id" integer NOT NULL, "deleted_by_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_9edd92a2287c93b164656e1d97f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_a96235c755bbc9b487ca95f63fd" FOREIGN KEY ("quest_id") REFERENCES "quest"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_0c08a3d04a9ee73f523fcb9fe84" FOREIGN KEY ("user_personal_quest_id") REFERENCES "user_personal_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_646633cc52936cbc76b58b168c6" FOREIGN KEY ("user_quest_id") REFERENCES "user_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_personal_quest" ADD CONSTRAINT "FK_abc0f1fe21d168b07f4d053c0cb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_personal_quest" ADD CONSTRAINT "FK_ab2a6268184d407edf1b49a52b6" FOREIGN KEY ("personal_quest_id") REFERENCES "personal_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "personal_quest" ADD CONSTRAINT "FK_3a6cb157ad1370e1b9eb8089c64" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quest" ADD CONSTRAINT "FK_d8878a53552007dcc0e48d7dbb7" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quest" ADD CONSTRAINT "FK_c0d328ab83e59b7d3fa5299bc41" FOREIGN KEY ("deleted_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest" DROP CONSTRAINT "FK_c0d328ab83e59b7d3fa5299bc41"`);
        await queryRunner.query(`ALTER TABLE "quest" DROP CONSTRAINT "FK_d8878a53552007dcc0e48d7dbb7"`);
        await queryRunner.query(`ALTER TABLE "personal_quest" DROP CONSTRAINT "FK_3a6cb157ad1370e1b9eb8089c64"`);
        await queryRunner.query(`ALTER TABLE "user_personal_quest" DROP CONSTRAINT "FK_ab2a6268184d407edf1b49a52b6"`);
        await queryRunner.query(`ALTER TABLE "user_personal_quest" DROP CONSTRAINT "FK_abc0f1fe21d168b07f4d053c0cb"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_646633cc52936cbc76b58b168c6"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_0c08a3d04a9ee73f523fcb9fe84"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_a96235c755bbc9b487ca95f63fd"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_9edd92a2287c93b164656e1d97f"`);
        await queryRunner.query(`DROP TABLE "quest"`);
        await queryRunner.query(`DROP INDEX "public"."user_username_key"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "personal_quest"`);
        await queryRunner.query(`DROP TABLE "user_personal_quest"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "user_quest"`);
    }

}

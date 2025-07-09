import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742387932083 implements MigrationInterface {
    name = 'Migration1742387932083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quest_suggestion_vote" ("id" SERIAL NOT NULL, "vote" boolean NOT NULL, "quest_suggestion_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a50827313e4045e7987f9b75efe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_suggestion" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "created_by_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e947daf056f1abef38edc79201f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest_suggestion_vote" ADD CONSTRAINT "FK_b1e6dcdcbc5208d3489b1c4a5ac" FOREIGN KEY ("quest_suggestion_id") REFERENCES "quest_suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quest_suggestion_vote" ADD CONSTRAINT "FK_f9e26a101043db1de8bfaa6ba80" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quest_suggestion" ADD CONSTRAINT "FK_90a156baff301a0f48feee521bf" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_suggestion" DROP CONSTRAINT "FK_90a156baff301a0f48feee521bf"`);
        await queryRunner.query(`ALTER TABLE "quest_suggestion_vote" DROP CONSTRAINT "FK_f9e26a101043db1de8bfaa6ba80"`);
        await queryRunner.query(`ALTER TABLE "quest_suggestion_vote" DROP CONSTRAINT "FK_b1e6dcdcbc5208d3489b1c4a5ac"`);
        await queryRunner.query(`DROP TABLE "quest_suggestion"`);
        await queryRunner.query(`DROP TABLE "quest_suggestion_vote"`);
    }

}

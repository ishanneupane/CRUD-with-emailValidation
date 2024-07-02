import { MigrationInterface, QueryRunner } from "typeorm";

export class Table21719911453686 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "migrateUser" (
            "id" SERIAL PRIMARY KEY,
            "fullname" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "migrateUser"`);
    }

}

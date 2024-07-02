"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table21719911453686 = void 0;
class Table21719911453686 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "migrateUser"`);
    }
}
exports.Table21719911453686 = Table21719911453686;

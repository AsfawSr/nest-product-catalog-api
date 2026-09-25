import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceIndex1790330460170 implements MigrationInterface {
    name = 'AddPriceIndex1790330460170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_75895eeb1903f8a17816dafe0a" ON "products"  ("price") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_75895eeb1903f8a17816dafe0a"`);
    }

}

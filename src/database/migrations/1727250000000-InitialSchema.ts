import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1727250000000 implements MigrationInterface {
  name = 'InitialSchema1727250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "category" character varying(100) NOT NULL,
        "stock" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_4c9fb58de893725258746385e1" ON "products" ("name")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_c3932231d2385ac248d0888d95" ON "products" ("category")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_c3932231d2385ac248d0888d95"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_4c9fb58de893725258746385e1"
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS "products"
    `);
  }
}

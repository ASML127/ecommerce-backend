// src/drizzle/drizzle.module.ts
import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import 'dotenv/config';

export type DrizzleDb = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useFactory: (): DrizzleDb => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const db: DrizzleDb = drizzle(pool, { schema });
        return db;
      },
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DrizzleModule {}

// // src/db.ts
// import { Pool, PoolClient, QueryResult } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// type QRes<T> = Promise<QueryResult<T>>;

// export class Pg {
//   private static _i: Pg | null = null;
//   private pool: Pool;

//   private constructor() {
//     this.pool = new Pool({
//       host: process.env.PGHOST,
//       port: Number(process.env.PGPORT) || 5432,
//       database: process.env.PGDATABASE,
//       user: process.env.PGUSER,
//       password: process.env.PGPASSWORD,
//       max: 10,
//       idleTimeoutMillis: 30_000,
//       connectionTimeoutMillis: 5_000,
//     });
//     this.pool.on("error", (err) => console.error("Unexpected PG error:", err));
//   }

//   static get i(): Pg {
//     if (!this._i) this._i = new Pg();
//     return this._i;
//   }

//   // Query helper
//   q<T = any>(text: string, params?: any[]): QRes<T> {
//     return this.pool.query<T>(text, params);
//   }

//   // Transaction helper
//   async tx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
//     const c = await this.pool.connect();
//     try {
//       await c.query("BEGIN");
//       const res = await fn(c);
//       await c.query("COMMIT");
//       return res;
//     } catch (e) {
//       await c.query("ROLLBACK");
//       throw e;
//     } finally {
//       c.release();
//     }
//   }

//   // Graceful shutdown
//   async end(): Promise<void> {
//     await this.pool.end();
//   }
// }

// // Optional default instance for convenience
// export const db = Pg.i;

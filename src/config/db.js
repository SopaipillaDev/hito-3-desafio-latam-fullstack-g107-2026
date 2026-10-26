import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Supabase usa conexión cifrada (DB_SSL=true); PostgreSQL local, DB_SSL=false
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  allowExitOnIdle: true
});

export default pool;

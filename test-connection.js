// test-connection.js
import dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables from .env
dotenv.config({path: '.env'});

const pool = new Pool();  // pg will read PGHOST, PGUSER, etc. automatically

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to Postgres!");
    client.release();
  } catch (err) {
    console.error("❌ Postgres connection error:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();

import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({path: '.env'});

const pool = new Pool(); 

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

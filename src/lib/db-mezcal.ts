/**
 * Database connection for Mezcal Leads System
 * Connects to Neon PostgreSQL database
 */

import { Pool, QueryResult, QueryResultRow } from 'pg';

// Connection pool para Mezcal database
const poolMezcal = new Pool({
  connectionString: process.env.DATABASE_URL_MEZCAL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Handle pool errors
poolMezcal.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client (Mezcal)', err);
  process.exit(-1);
});

/**
 * Execute a query on the Mezcal database
 * @param text SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function queryMezcal<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await poolMezcal.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query (Mezcal)', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error (Mezcal):', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transaction support
 */
export async function getClientMezcal() {
  const client = await poolMezcal.connect();
  return client;
}

/**
 * Close the connection pool (useful for graceful shutdown)
 */
export async function closeMezcalPool() {
  await poolMezcal.end();
}

export default poolMezcal;

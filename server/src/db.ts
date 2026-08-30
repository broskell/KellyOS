import { MongoClient, type Db } from "mongodb";

/**
 * Editing API only. Never imported from `src/` (visitor / prerender).
 *
 * Assumptions (disclosed): one long-running Fastify process, admin-only, low
 * concurrency. Visitor traffic must not use this client.
 */
export function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60_000,
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 5_000,
  });
}

export function databaseNameFromUri(uri: string, fallback: string): string {
  try {
    const parsed = new URL(uri.replace(/^mongodb\+srv/i, "https"));
    const name = parsed.pathname.replace(/^\//, "").split("?")[0];
    if (name) return decodeURIComponent(name);
  } catch {
    /* URI parse failed — use fallback, never log the URI */
  }
  return fallback;
}

export async function openEditingDatabase(client: MongoClient, dbName: string): Promise<Db> {
  await client.connect();
  return client.db(dbName);
}

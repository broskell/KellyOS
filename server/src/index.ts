import { buildEditingApp } from "./app";
import { createMongoClient, databaseNameFromUri, openEditingDatabase } from "./db";
import { MongoContentStore } from "./mongoStore";

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required for the editing API. Do not put it in source control.");
    process.exit(1);
  }
  if (!process.env.KELLOS_ADMIN_TOKEN) {
    console.error("KELLOS_ADMIN_TOKEN is required. Generate a long random secret; do not commit it.");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB || databaseNameFromUri(uri, "kellos_edit");
  const client = createMongoClient(uri);
  const db = await openEditingDatabase(client, dbName);
  const store = new MongoContentStore(db);
  await store.ensureIndexesAndValidators();

  const app = await buildEditingApp(store);
  const port = Number(process.env.KELLOS_EDIT_PORT || 8787);
  const host = process.env.KELLOS_EDIT_HOST || "127.0.0.1";
  await app.listen({ port, host });
  console.log(`KELL.OS editing API on http://${host}:${port} (not the visitor site)`);

  const shutdown = async () => {
    await app.close();
    await client.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : "editing API failed to start");
  process.exit(1);
});

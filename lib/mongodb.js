import mongoose from "mongoose";

const globalCache = globalThis.__beautyAppMongo ?? {
  connection: null,
  promise: null
};

globalThis.__beautyAppMongo = globalCache;

export async function connectMongo() {
  const mongodbUri = process.env.MONGODB_URI;
  const mongodbDb = process.env.MONGODB_DB;

  if (!mongodbUri) {
    return null;
  }

  if (globalCache.connection) {
    return globalCache.connection;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(mongodbUri, {
      dbName: mongodbDb || "beautyapp"
    });
  }

  globalCache.connection = await globalCache.promise;
  return globalCache.connection;
}

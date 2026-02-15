import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache || {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI);
  }

  cache.conn = await cache.promise;
  globalForMongoose.mongooseCache = cache;
  return cache.conn;
}

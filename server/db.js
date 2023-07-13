require('dotenv').config();
const { MongoClient } = require('mongodb');

const URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_NAME || 'qanda';
let db;

const connectDb = async () => {
  if (db) {
    return db;
  }

  const client = await MongoClient.connect(URL, { useUnifiedTopology: true });
  db = client.db(DB_NAME);
  return db;
};

module.exports = connectDb;

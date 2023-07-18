require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DBNAME || 'qanda';
let db;

const connectDb = async () => {
  if (db) {
    return db;
  }

  const client = await MongoClient.connect(URI, { useUnifiedTopology: true });
  db = client.db(DB_NAME);

  return db;
};

exports.connectDb = connectDb;

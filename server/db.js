require('dotenv').config();
const { MongoClient } = require('mongodb');

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST || 'localhost:27017';
const DB_NAME = process.env.MONGO_DBNAME || 'qanda';
const URI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}`;

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

require('dotenv').config();
const { MongoClient } = require('mongodb');

const USERNAME = encodeURIComponent(process.env.USERNAME);
const PASSWORD = encodeURIComponent(process.env.PASSWORD);
const HOST = process.env.HOST || 'localhost:27017';
const DB_NAME = process.env.MONGO_DBNAME || 'qanda';
const URI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}/?authMechanism=DEFAULT&authSource=qanda`;
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

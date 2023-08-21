require('dotenv').config();

const express = require('express');
const router = require('./routes');
const morgan = require('morgan');

const { connectDb } = require('./db');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

const startServer = async () => {
  try {
    const db = await connectDb();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/qa/questions', router);

    app.listen(PORT, () => {
      console.log(`Connected to ${db.databaseName}, Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};
startServer();

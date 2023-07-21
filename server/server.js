require('dotenv').config();

const express = require('express');
const router = require('./routes');
const morgan = require('morgan');
// const compression = require('compression');

const { connectDb } = require('./db');

const app = express();
// Server variables
const PORT = process.env.EXPRESS_PORT || 3000;

// Create an async function in order to connect to DB before starting server
const startServer = async () => {
  try {
    const db = await connectDb();

    //middleware
    // app.use(morgan('dev'));
    // app.use(compression());
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

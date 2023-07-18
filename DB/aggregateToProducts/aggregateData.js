require('dotenv').config();
const createPhotosAnswers = require('./createPhotosAnswers');
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DBNAME || 'qanda';

const addIndexes = async () => {
  try {
    const client = await MongoClient.connect(URI, {
      useUnifiedTopology: true,
    });
    const db = client.db(DB_NAME);
    const answerPhotosCollection = db.collection('AnswerAndPhotos');
    const questionsCollection = db.collection('Questions');

    await answerPhotosCollection.createIndex({ question_id: 1 });
    await answerPhotosCollection.createIndex({ id: 1 });
    await questionsCollection.createIndex({ id: 1 });
    await questionsCollection.createIndex({ product_id: 1 });
    await questionsCollection.createIndex({ reported: 1 });
  } catch (err) {
    console.error(err);
  }
};

const aggregateData = async () => {
  try {
    await createPhotosAnswers();
  } catch (err) {
    console.err(err);
  }
};

aggregateData();
addIndexes();

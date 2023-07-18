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
    console.log('Creating Indexes....');
    await answerPhotosCollection.createIndex({ question_id: 1 });
    console.log('Completed 1/5 Indexes');
    await answerPhotosCollection.createIndex({ id: 1 });
    console.log('Completed 2/5 Indexes');
    await questionsCollection.createIndex({ id: 1 });
    console.log('Completed 3/5 Indexes');
    await questionsCollection.createIndex({ product_id: 1 });
    console.log('Completed 4/5 Indexes');
    await questionsCollection.createIndex({ reported: 1 });
    console.log('Completed 5/5 Indexes');
    console.log('Successfully created all Indexes!');
    client.close();
  } catch (err) {
    console.error(err);
  }
};

const aggregateData = async () => {
  try {
    console.log('Creating Collection....');

    await createPhotosAnswers();
    console.log('Successfully created Collection!');
  } catch (err) {
    console.error(err);
  }
};

const runScript = async () => {
  await aggregateData();
  await addIndexes();
};

runScript();

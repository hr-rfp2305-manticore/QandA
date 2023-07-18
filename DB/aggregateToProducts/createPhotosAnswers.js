require('dotenv').config();
const { MongoClient } = require('mongodb');
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DBNAME || 'qanda';

const createPhotosAnswers = async () => {
  console.log(`Connecting to ${DB_NAME} at ${URI}`);
  const client = await MongoClient.connect(URI, {
    useUnifiedTopology: true,
  });
  console.log('Connection successful');
  const db = client.db(DB_NAME);

  // Define collections
  const answersCollection = db.collection('Answers');
  const photosCollection = db.collection('Photos');

  // Create indexes
  await answersCollection.createIndex({ id: 1 });
  await photosCollection.createIndex({ answer_id: 1 });

  console.time('Step 1/3 Complete'); // Start timer

  const cursor = answersCollection.aggregate([
    {
      $lookup: {
        from: 'Photos',
        localField: 'id',
        foreignField: 'answer_id',
        as: 'photos',
      },
    },
    {
      $addFields: {
        photos: {
          $map: {
            input: '$photos',
            as: 'photo',
            in: '$$photo.url',
          },
        },
      },
    },
    {
      $merge: 'AnswerAndPhotos',
    },
  ]);
  await cursor.toArray();
  console.timeEnd('Step 1/3 Complete'); // End timer and print the duration

  client.close();
};

module.exports = createPhotosAnswers;

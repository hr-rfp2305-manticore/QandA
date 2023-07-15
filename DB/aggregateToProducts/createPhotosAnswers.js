const { MongoClient } = require('mongodb');

const createPhotosAnswers = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  // Define collections
  const answersCollection = db.collection('Answers');
  const photosCollection = db.collection('Photos');

  // Create indexes
  await answersCollection.createIndex({ id: 1 });
  await photosCollection.createIndex({ answer_id: 1 });

  console.time('Step 1/3 Complete'); // Start timer

  const cursor = answersCollection.aggregate([
    {
      $match: {
        reported: 0,
      },
    },
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

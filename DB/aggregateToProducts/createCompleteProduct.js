const { MongoClient } = require('mongodb');

const createCompleteProduct = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  // Define collections
  const quesAnsPhotoCollection = db.collection('QuestionAnswerPhoto');

  console.time('Step 3/3 Complete'); // Start timer

  const cursor = quesAnsPhotoCollection.aggregate([
    {
      $group: {
        _id: '$product_id',
        results: { $push: '$$ROOT' },
      },
    },
    {
      $merge: 'Products',
    },
  ]);
  await cursor.toArray();
  console.timeEnd('Step 3/3 Complete'); // End timer and print the duration

  client.close();
};

module.exports = createCompleteProduct;

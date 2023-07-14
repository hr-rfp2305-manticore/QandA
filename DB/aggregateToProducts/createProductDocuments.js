const { MongoClient } = require('mongodb');
const ProgressBar = require('progress');

const createProductDocuments = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  //Define collections
  const questionsCollection = db.collection('Questions');

  console.time('Aggregation Time'); // Start timer

  // Create Products collection this will include the questions data as well
  const cursor = questionsCollection.aggregate([
    {
      $group: {
        _id: '$product_id',
        results: { $push: '$$ROOT' },
      },
    },
    {
      $unset: 'product_id',
    },
    {
      $out: 'Products',
    },
  ]);
  await cursor.toArray();

  console.timeEnd('Aggregation Time'); // End timer and print the duration

  client.close();
};

module.exports = createProductDocuments;

const { MongoClient } = require('mongodb');
const ProgressBar = require('progress');

const createProductDocuments = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  //Define collections
  const photosCollections = db.collection('Photos');
  const answerCollections = db.collection('Answers');
  const questionsCollection = db.collection('Questions');

  // Get total number of documents
  const totalDocuments = await questionsCollection.countDocuments();
  console.log(totalDocuments);

  // Create a new progress bar
  let bar = new ProgressBar(':bar', { total: totalDocuments });

  const answersCursor = answerCollections.aggregate([
    {
      $lookup: {
        from: 'Photos',
        localField: 'id',
        foreignField: 'answer_id',
        as: 'photos',
      },
    },
    {
      $out: 'AnswersWPhoto',
    },
  ]);

  //Create Products collection this will include the questions data as well
  //   const cursor = questionsCollection.aggregate([
  //     {
  //       $group: {
  //         _id: '$product_id',
  //         results: { $push: '$$ROOT' },
  //       },
  //     },
  //     {
  //       $out: 'Products',
  //     },
  //   ]);
};

createProductDocuments();

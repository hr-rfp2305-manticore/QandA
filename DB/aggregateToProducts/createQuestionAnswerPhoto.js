const { MongoClient } = require('mongodb');

const createQuestionAnswerPhoto = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  const db = client.db('qanda');

  // Define collections
  const questionsCollections = db.collection('Questions');
  const answerAndPhotosCollections = db.collection('AnswerAndPhotos');

  // Create indexes on the fields used in the $lookup stage
  await questionsCollections.createIndex({ id: 1 });
  await answerAndPhotosCollections.createIndex({ question_id: 1 });

  console.time('Step 2/3 Complete');

  const cursor = questionsCollections.aggregate([
    {
      $lookup: {
        from: 'AnswerAndPhotos',
        localField: 'id',
        foreignField: 'question_id',
        as: 'answers',
      },
    },
    {
      $project: {
        product_id: '$product_id',
        question_id: '$id',
        question_body: '$body',
        asker_name: '$asker_name',
        asker_email: 'asker_email',
        question_helpfullness: '$helpful',
        reported: {
          $cond: {
            if: {
              reported: ['$qty', 0],
            },
            then: false,
            else: true,
          },
        },
        answers: '$answers',
      },
    },
    {
      $merge: 'QuestionAnswerPhoto',
    },
  ]);
  await cursor.toArray();

  console.timeEnd('Step 2/3 Complete');

  client.close();
};

module.exports = createQuestionAnswerPhoto;

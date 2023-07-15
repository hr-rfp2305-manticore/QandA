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
    // {
    //   $match: {
    //     reported: 0,
    //   },
    // },
    // {
    //   $lookup: {
    //     from: 'AnswerAndPhotos',
    //     localField: 'id',
    //     foreignField: 'question_id',
    //     as: 'answers',
    //   },
    // },

    {
      $addFields: {
        question_id: '$id',
        question_body: '$body',
        question_date: '$date',
        reported: {
          $cond: {
            if: {
              reported: ['$qty', 0],
            },
            then: false,
            else: true,
          },
        },
      },
    },
    {
      $lookup: {
        from: 'AnswerAndPhotos',
        localField: 'question_id',
        foreignField: 'question_id',
        as: 'answers',
      },
    },
    // {
    //   $unset: [
    //     'body',
    //     'id',
    //     'asker_email',
    //     'answers.question_id',
    //     'answers.answerer_email',
    //   ],
    // },

    {
      $merge: 'QuestionAnswerPhoto',
    },
  ]);
  await cursor.toArray();

  console.timeEnd('Step 2/3 Complete');

  client.close();
};

module.exports = createQuestionAnswerPhoto;

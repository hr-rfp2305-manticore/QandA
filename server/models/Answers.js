const connectDb = require('../db');

module.exports = {
  getAnswers: async (question_id, page, count) => {
    try {
      console.log(question_id);
      const db = await connectDb();
      const answersCollection = db.collection('QuestionAnswerPhoto');

      const cursor = answersCollection.aggregate([
        {
          $match: {
            question_id: question_id,
          },
        },
        {
          $unset: [
            'answers.answerer_email',
            'answers.reported',
            'answers.question_id',
          ],
        },
        {
          $addFields: {
            results: {
              $slice: ['$answers', count],
            },
            page: page,
            count: count,
            question: '$question_id',
          },
        },

        {
          $project: {
            answers: 0,
          },
        },
        {
          $addFields: {
            results: {
              $map: {
                input: '$results',
                as: 'result',
                in: {
                  $mergeObjects: [
                    '$$result',
                    {
                      answer_id: '$$result.id',
                    },
                  ],
                },
              },
            },
          },
        },

        {
          $unset: [
            '_id',
            'date_written',
            'helpful',
            'asker_name',
            'question_body',
            'reported',
            'product_id',
            'answers.question_id',
            'asker_email',
            'body',
            'id',
            'question_id',
            'results._id',
            'results.id',
          ],
        },
      ]);
      const data = await cursor.toArray();

      return data;
    } catch (err) {
      console.error(err);
    }
  },
};

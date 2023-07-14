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
          $addFields: {
            results: {
              $slice: ['$answers', count],
            },
            page: page,
            count: count,
          },
        },
        {
          $project: {
            answers: 0,
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
          ],
        },
        {
          $addFields: {},
        },
      ]);
      const data = await cursor.toArray();

      return data;
    } catch (err) {
      console.error(err);
    }
  },
};

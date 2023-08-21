const { connectDb } = require('../db');
const { productExists, questionExists } = require('./Utilities');
let db;
let questionsCollection;
let questionsLen = 0;

const createConnection = async () => {
  if (db) {
    return;
  }
  db = await connectDb();
  questionsCollection = db.collection('Questions');
  questionsLen = await questionsCollection.countDocuments({});
};

createConnection();
module.exports = {
  getQuestions: async (product_id, page, count) => {
    const skipTo = (page - 1) * count;
    try {
      const isValidId = await productExists(product_id);
      if (!isValidId) {
        return {
          status: 403,
          data: { msg: 'No products with this id exist' },
        };
      }

      const cursor = questionsCollection.aggregate([
        {
          $match: { product_id: product_id, reported: 0 },
        },
        {
          $skip: skipTo,
        },
        {
          $limit: count,
        },
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
            question_id: '$id',
            question_body: '$body',
            asker_name: '$asker_name',
            asker_email: 'asker_email',
            question_helpfulness: '$helpful',
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
          $group: {
            _id: product_id,
            results: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $project: {
            product_id: '$_id',
            results: '$results',
          },
        },
        {
          $project: {
            _id: 0,
            'results._id': 0,
            'results.product_id': 0,
            'results.asker_email': 0,
            'results.answers._id': 0,
            'results.answers.answerer_email': 0,
            'results.answers.question_id': 0,
            'results.answers.reported': 0,
          },
        },
      ]);
      const data = await cursor.toArray();
      // console.log(data);
      return { status: 200, data: data[0] };
      return data[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  postQuestion: async (product_id, body, name, email) => {
    try {
      const isValidId = await productExists(product_id);
      if (!isValidId) {
        return {
          status: 403,
          data: { msg: 'No products with this id exists' },
        };
      }

      const document = {
        id: questionsLen + 1,
        product_id: product_id,
        body: body,
        asker_email: email,
        asker_name: name,
        reported: 0,
        helpful: 0,
      };

      const result = await questionsCollection.insertOne(document);

      if (result.acknowledged) {
        questionsLen++;
      }
      return { status: 204, data: { question_id: questionsLen } };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  putHelp: async (question_id) => {
    try {
      const isValidId = await questionExists(question_id);
      if (!isValidId) {
        return {
          status: 403,
          data: { msg: 'No question exists with this id' },
        };
      }
      const data = await questionsCollection.updateOne(
        { id: question_id },
        { $inc: { helpful: 1 } }
      );
      return { status: 204, data: null };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  putReport: async (question_id) => {
    try {
      const isValidId = await questionExists(question_id);
      if (!isValidId) {
        return {
          status: 403,
          data: { msg: 'No question exists with this id' },
        };
      }
      await questionsCollection.updateOne(
        {
          id: question_id,
        },
        { $inc: { reported: 1 } }
      );
      return { status: 204, data: null };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  readTest: async (question_id) => {
    try {
      const data = await questionsCollection.findOne({ id: question_id });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

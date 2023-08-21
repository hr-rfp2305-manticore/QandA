const { connectDb } = require('../db');
let db;
let answersCollection;
let answersLen = 0;

const createConnection = async () => {
  if (db) {
    return;
  }
  db = await connectDb();
  answersCollection = db.collection('AnswerAndPhotos');
  answersLen = await answersCollection.countDocuments({});
  console.log(answersLen);
};

createConnection();

module.exports = {
  getAnswers: async (question_id, page, count) => {
    console.log('MODEL', page, count);
    const skipTo = (page - 1) * count;
    try {
      const cursor = answersCollection.aggregate([
        {
          $match: {
            question_id: 1,
          },
        },
        {
          $skip: 0,
        },
        {
          $limit: 10,
        },
        {
          $project: {
            question: 1,
            answer_id: '$id',
            body: '$body',
            date: '$date_written',
            answerer_name: '$answerer_name',
            helpfulness: '$helpful',
            photos: '$photos',
          },
        },
        {
          $group: {
            _id: 'question_id',
            results: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $addFields: {
            question: 1,
            page: 1,
            count: 1,
          },
        },
        {
          $project: {
            _id: 0,
            question: 1,
            results: 1,
            page: 1,
            count: 1,
          },
        },
        {
          $project: {
            'results._id': 0,
          },
        },
      ]);
      const data = await cursor.toArray();
      return data;
    } catch (err) {
      console.error(err);
    }
  },

  insertAnswer: async (question_id, body, name, email, photos) => {
    console.log('questionid: ', question_id);
    const document = {
      answerer_email: email,
      answerer_name: name,
      body: body,
      date_written: Date.now(),
      helpful: 0,
      id: answersLen + 1,
      photos: photos,
      question_id: Number.parseInt(question_id),
      reported: 0,
    };

    const result = await answersCollection.insertOne(document);
    console.log(result);
    if (result.acknowledged) {
      answersLen++;
    }
    return { ...result, id: answersLen };
  },

  putHelp: async (answer_id) => {
    try {
      const data = await answersCollection.updateOne(
        { id: answer_id },
        { $inc: { helpful: 1 } }
      );
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  putReport: async (answer_id) => {
    try {
      const data = await answersCollection.updateOne(
        { id: answer_id },
        { $inc: { reported: 1 } }
      );
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  readTest: async (answer_id) => {
    try {
      const data = await answersCollection.findOne({ id: answer_id });
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

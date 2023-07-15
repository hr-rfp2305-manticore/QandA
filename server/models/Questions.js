const { connectDb } = require('../db');
const buffer = [];
let questionsLen = 0;
let db;
let questionsCollection;

const createConnection = async () => {
  if (db) {
    return;
  }
  db = await connectDb();
  questionsCollection = db.collection('QuestionAnswerPhoto');
  questionsLen = await questionsCollection.countDocuments({});
};

createConnection();

module.exports = {
  getQuestions: async (product_id, page, count) => {
    const skipTo = (page - 1) * count;
    try {
      // const db = await connectDb();
      // const productCollection = db.collection('QuestionAnswerPhoto');
      console.log(count, page);
      // Uncomment this line to increase query speed
      // questionsCollection.createIndex({ product_id: 1 });

      const data = await questionsCollection
        .find(
          { product_id: product_id, reported: { $eq: false } },
          { projection: { product_id: 0 } }
        )
        .limit(count)
        .skip(skipTo)
        .toArray();
      // console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  postQuestion: async (product_id, body, name, email) => {
    try {
      // const db = await connectDb();
      // const questionsCollection = db.collection('QuestionAnswerPhoto');
      // if (questionsLen === 0) {
      //   questionsLen = await questionsCollection.countDocuments({});
      // }

      questionsLen++;

      const document = {
        answers: [],
        asker_email: email,
        asker_name: name,
        product_id: product_id,
        question_body: body,
        question_helpfullness: 0,
        question_id: questionsLen,
        reported: false,
      };

      const result = await questionsCollection.insertOne(document);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  // Future Buffer set up
  // postQuestion: async (product_id, body, name, email) => {
  //   const document = {
  //     answers: [],
  //     asker_email: email,
  //     asker_name: name,
  //     product_id: product_id,
  //     question_body: body,
  //     question_helpfullness: 0,
  //     question_id: buffer.length,
  //     reported: false,
  //   };
  //   buffer.push(document);
  //   console.log(buffer);
  //   return document;
  // },

  putHelp: async (question_id) => {
    try {
      // const db = await connectDb();
      // const questionsCollection = db.collection('QuestionAnswerPhoto');
      const data = await questionsCollection.updateOne(
        { question_id: question_id },
        { $inc: { question_helpfulness: 1 } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  putReport: async (question_id) => {
    try {
      const data = await questionsCollection.updateOne(
        {
          question_id: question_id,
        },
        { $set: { reported: true } }
      );
      return data;
    } catch (err) {
      console.error(err);
    }
  },
};

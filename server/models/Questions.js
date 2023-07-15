const connectDb = require('../db');
const buffer = [];

module.exports = {
  getQuestions: async (product_id, page, count) => {
    const skipTo = (page - 1) * count;
    try {
      const db = await connectDb();
      const productCollection = db.collection('QuestionAnswerPhoto');
      console.log(count, page);
      // Uncomment this line to increase query speed
      // productCollection.createIndex({ product_id: 1 });

      const data = await productCollection
        .find({ product_id: product_id }, { projection: { product_id: 0 } })
        .limit(5)
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
      const db = await connectDb();
      const questionsCollection = db.collection('QuestionAnswerPhoto');
      const collectionLength = await questionsCollection.countDocuments({});

      const document = {
        answers: [],
        asker_email: email,
        asker_name: name,
        product_id: product_id,
        question_body: body,
        question_helpfullness: 0,
        question_id: collectionLength + 1,
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
};

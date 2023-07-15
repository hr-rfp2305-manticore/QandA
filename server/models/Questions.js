const connectDb = require('../db');

module.exports = {
  getQuestions: async (product_id, page = 1, count = 5) => {
    try {
      const db = await connectDb();
      const productCollection = db.collection('QuestionAnswerPhoto');

      const data = await productCollection
        .find({ product_id: product_id }, { projection: { product_id: 0 } })
        .limit(count)
        .skip((page - 1) * count)
        .toArray();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  },
};

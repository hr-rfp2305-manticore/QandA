const { connectDb } = require('../db');
const buffer = [];
let db;
let questionsCollection;
let questionsLen = 0;

const createConnection = async () => {
  if (db) {
    return;
  }
  db = await connectDb();
  questionsCollection = db.collection('Questions');
};

createConnection();

module.exports = {
  productExists: async (id) => {
    try {
      const result = await questionsCollection.findOne({ product_id: id });
      return result === null ? false : true;
    } catch (err) {
      console.error(err);
    }
  },
  questionExists: async (id) => {
    try {
      const result = await questionsCollection.findOne({ id: id });
      return result === null ? false : true;
    } catch (err) {
      console.error(err);
    }
  },
};

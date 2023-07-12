require('dotenv').config();
const dummyProduct = require('../dummyProductQuestion');

const mongoose = require('mongoose');

const DB_NAME = process.env.DB_NAME || 'qanda';

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`Connected to ${process.env.DB_NAME}`);
});

const PhotoSchema = new mongoose.Schema({ url: String });

const AnswersSchema = new mongoose.Schema({
  id: Number,
  body: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number,
  photos: [PhotoSchema],
});

const QuestionSchema = new mongoose.Schema({
  question_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [AnswersSchema],
});

const ProductSchema = new mongoose.Schema({
  product_id: Number,
  results: [QuestionSchema],
});

const Product = mongoose.model('Product', ProductSchema);

/// Transform dummy data and insert into DB
const transformData = (data) => {
  const transformedData = {
    product_id: data.product_id,
    results: data.results.map((question) => ({
      question_id: question.question_id,
      question_body: question.question_body,
      question_date: question.question_date,
      asker_name: question.asker_name,
      question_helpfulness: question.question_helpfulness,
      reported: question.reported,
      answers: Object.values(question.answers).map((answer) => ({
        id: answer.id,
        body: answer.body,
        date: answer.date,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpfulness,
        photos: answer.photos.map((photo) => ({ url: photo })),
      })),
    })),
  };

  return transformedData;
};

const transformedData = transformData(dummyProduct);

const product = new Product(transformedData);

product
  .save()
  .then((doc) => {
    console.log('Saved successfully', doc);
  })
  .catch((err) => {
    console.error(err);
  });

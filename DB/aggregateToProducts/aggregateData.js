const createPhotosAnswers = require('./createPhotosAnswers');
const createQuestionAnswerPhoto = require('./createQuestionAnswerPhoto');
const createCompleteProduct = require('./createCompleteProduct');

const aggregateData = async () => {
  await createPhotosAnswers();
  // await createQuestionAnswerPhoto();
  // await createCompleteProduct();
};
aggregateData().catch(console.error);

aggregateData();

const createPhotosAnswers = require('./createPhotosAnswers');
const createQuestionAnswerPhoto = require('./createQuestionAnswerPhoto');
const createCompleteProduct = require('./createCompleteProduct');

// run me

const aggregateData = async () => {
  // console.time('Total Time');
  // await createPhotosAnswers();
  await createQuestionAnswerPhoto();
  await createCompleteProduct();
  // console.timeEnd('Total Time');
};
aggregateData().catch(console.error);

aggregateData();

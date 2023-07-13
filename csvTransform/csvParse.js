const csvParser = require('csv-parser');
const { transform } = require('stream-transform');
const fs = require('fs');
const path = require('path');
const results = [];
const questions = [];
const answers = [];
const photos = [];

fs.createReadStream('../answers.csv')
  .pipe(csvParser())
  .on('data', (data) => answers.push(data))
  .on('end', () => {
    console.log(answers.slice(0, 10));
  });

fs.createReadStream('../questions.csv')
  .pipe(csvParser())
  .on('data', (data) => questions.push(data))
  .on('end', () => {
    console.log(questions.slice(0, 10));
  });

fs.createReadStream('../answers_photos.csv')
  .pipe(csvParser())
  .on('data', (data) => photos.push(data))
  .on('end', () => {
    console.log(photos.slice(0, 10));
  });

const transformer = transform(function (data) {
  data.push(data.shift());
  return data;
});

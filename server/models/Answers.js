const { connectDb } = require('../db');
let db;
let answersCollection;
let answersLen = 0;

let buffer = [];

const createConnection = async () => {
  if (db) {
    return;
  }
  db = await connectDb();
  answersCollection = db.collection('AnswerAndPhotos');
  answersLen = await answersCollection.countDocuments({});
};

createConnection();

module.exports = {
  getAnswers: async (question_id, page, count) => {
    const skipTo = (page - 1) * count;
    try {
      const cursor = answersCollection.aggregate(
        [
          {
            $match: {
              question_id: question_id,
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
        ]
        // [
        //   {
        //     $match: {
        //       question_id: question_id,
        //     },
        //   },
        //   {
        //     $skip: skipTo,
        //   },
        //   {
        //     $limit: count,
        //   },
        //   {
        //     $project: {
        //       question: question_id,
        //       answer_id: '$id',
        //       body: '$body',
        //       date: '$date_written',
        //       answerer_name: '$answerer_name',
        //       helpfulness: '$helpful',
        //       photos: '$photos',
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: question_id,
        //       results: {
        //         $push: '$$ROOT',
        //       },
        //     },
        //   },
        //   {
        //     $addFields: {
        //       page: 1,
        //       count: count,
        //       question: question_id,
        //     },
        //   },
        // ]
      );
      const data = await cursor.toArray();
      return data;

      // Slowest
      // const cursor = answersCollection.aggregate([
      //   {
      //     $match: {
      //       question_id: question_id,
      //     },
      //   },
      //   {
      //     $unset: [
      //       'answers.answerer_email',
      //       'answers.reported',
      //       'answers.question_id',
      //     ],
      //   },
      //   {
      //     $addFields: {
      //       results: {
      //         $slice: ['$answers', count],
      //       },
      //       page: page,
      //       count: count,
      //       question: '$question_id',
      //     },
      //   },

      //   {
      //     $project: {
      //       answers: 0,
      //     },
      //   },
      //   {
      //     $addFields: {
      //       results: {
      //         $map: {
      //           input: '$results',
      //           as: 'result',
      //           in: {
      //             $mergeObjects: [
      //               '$$result',
      //               {
      //                 answer_id: '$$result.id',
      //               },
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   },

      //   {
      //     $unset: [
      //       '_id',
      //       'date_written',
      //       'helpful',
      //       'asker_name',
      //       'question_body',
      //       'reported',
      //       'product_id',
      //       'answers.question_id',
      //       'asker_email',
      //       'body',
      //       'id',
      //       'question_id',
      //       'results._id',
      //       'results.id',
      //     ],
      //   },
      // ]);

      // Cleaned up version
      // const cursor = answersCollection.aggregate([
      //   {
      //     $match: {
      //       question_id: question_id,
      //     },
      //   },
      //   {
      //     $project: {
      //       answers: {
      //         $slice: ['$answers', count],
      //       },
      //       question: '$question_id',
      //     },
      //   },
      //   {
      //     $project: {
      //       results: {
      //         $map: {
      //           input: '$answers',
      //           as: 'result',
      //           in: {
      //             answer_id: '$$result.id',
      //             body: '$$result.body',
      //             date: '$$result.date_written',
      //             answerer_name: '$$result.answerer_name',
      //             helpfulness: '$$result.helpful',
      //             photos: '$$result.photos',
      //           },
      //         },
      //       },
      //       question: '$question',
      //       count: count,
      //       page: page,
      //     },
      //   },
      // ]);
      // const data = await cursor.toArray();

      // return data;
    } catch (err) {
      console.error(err);
    }
  },

  insertAnswer: async (question_id, body, name, email, photos) => {
    const newAnswerId = answersLen + 1;
    console.log(newAnswerId);
    const document = {
      answerer_email: email,
      answerer_name: name,
      body: body,
      date_written: Date.now(),
      helpful: 0,
      id: newAnswerId,
      photos: photos,
      question_id: Number.parseInt(question_id),
      reported: 0,
    };

    const debounce = (fn, delay) => {
      let id;
      return (...args) => {
        if (id) {
          clearTimeout(id);
        }
        id = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    };

    const insertBuffer = () => {
      // if buffer length is one insertOne
      if (buffer.length === 1) {
        answersCollection.insertOne(buffer[0]);
      } else if (buffer.length > 1) {
        answersCollection.insertMany(buffer);
        buffer = [];
      }
      return newAnswerId;
    };

    const insertCheck = () => {
      buffer.push(document);
      if (buffer.length === 1000) {
        answersCollection.insertMany(buffer);
        buffer = [];
        return newAnswerId;
      }
      debounce(insertBuffer, 50);
    };
    // else buffer insert many

    // if buffer length is 1000

    // await docsCollection.findOne{question_id:}
    // const result = await answersCollection.insertOne(document);

    // if (result.acknowledged) {
    //   answersLen++;
    // }
    try {
      answersLen++;
      console.log(buffer);
      insertCheck();
    } catch (err) {
      console.error(err);
      throw err;
    }

    // return { ...result, id: answersLen };
  },

  putHelp: async (answer_id) => {
    try {
      const data = await answersCollection.updateOne(
        { id: answer_id },
        { $inc: { helpful: 1 } }
      );
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
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  readTest: async (answer_id) => {
    try {
      const data = await answersCollection.findOne({ id: answer_id });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

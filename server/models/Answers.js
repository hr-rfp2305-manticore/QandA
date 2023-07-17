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
            question_id: question_id,
          },
        },
        {
          $skip: skipTo,
        },
        {
          $limit: count,
        },
        {
          $project: {
            question: question_id,
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
            _id: question_id,
            results: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $addFields: {
            page: 1,
            count: count,
            question: question_id,
          },
        },
      ]);
      const data = await cursor.toArray();
      console.log(data[0]);
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
    console.log('questionid: ', question_id);

    // MAKE SURE TO WRITE ABOUT THIS!!!!! NOW THE DOCUMENTS DONT HAVE TO BE COUNTED.
    // STORE LENGTH GLOBALLY AND ADD TO THE COUNT. NOW THE USER DOES NOT HAVE TO WAIT FOR A RESPONSE
    // MAYBE GET THESE LENGTHS IN THE DB FILE AT LOAD

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

    // await docsCollection.findOne{question_id:}
    const result = await answersCollection.insertOne(document);

    if (result.acknowledged) {
      answersLen++;
    }
    return { ...result, id: answersLen };
  },
};

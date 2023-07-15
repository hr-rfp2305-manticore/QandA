const { Answers } = require('../models');

module.exports = {
  get: async (req, res) => {
    const { question_id } = req.params;
    let { page, count } = req.query;
    if (!count) {
      count = 5;
    }
    if (!page) {
      page = 1;
    }
    console.log(req.query);
    try {
      const data = await Answers.getAnswers(
        Number.parseInt(question_id),
        Number.parseInt(page),
        Number.parseInt(count)
      );
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  post: async (req, res) => {
    const { body, name, email, photo } = req.body;
    const { question_id } = req.params;
    console.log(question_id);
    console.log(body);
    console.log(name);
    console.log(email);
    console.log(photo);
    res.status(201).send('You are posting an answer!');
  },
};

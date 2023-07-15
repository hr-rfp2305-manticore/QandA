const { Answers } = require('../models');

module.exports = {
  get: async (req, res) => {
    const { question_id } = req.params;
    let { page, count } = req.body;
    count = checkInput(count, 5);
    page = checkInput(page, 1);

    try {
      const data = await Answers.getAnswers(
        Number.parseInt(question_id),
        page,
        count
      );
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  post: async (req, res) => {
    const { body, name, email, photos } = req.body;
    const { question_id } = req.params;

    try {
      const data = await Answers.insertAnswer(
        question_id,
        body,
        name,
        email,
        photos
      );
      res.status(201).send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },
};

const checkInput = (parameter, defaultAmount) => {
  if (!parameter) {
    return defaultAmount;
  } else {
    return Number.parseInt(parameter);
  }
};

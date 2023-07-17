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
      if (data.length === 0) {
        res.status(404).send(`No question with an id ${question_id} exists`);
      } else {
        res.send(data[0]);
      }
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

  putHelp: async (req, res) => {
    const { answer_id } = req.params;
    try {
      const data = await Answers.putHelp(Number.parseInt(answer_id));
      res.status(204).send();
    } catch (err) {
      res.status(400).send(err);
    }
  },

  putReport: async (req, res) => {
    const { answer_id } = req.params;
    try {
      const data = await Answers.putReport(Number.parseInt(answer_id));
      res.status(204).send();
    } catch (err) {
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

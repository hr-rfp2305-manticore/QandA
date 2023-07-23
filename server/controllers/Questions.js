const { Questions } = require('../models');
// const { param } = require('../routes');

module.exports = {
  get: async (req, res) => {
    let { page, count } = req.query;
    let { product_id } = req.params;
    count = checkInput(count, 5);
    page = checkInput(page, 1);

    try {
      const data = await Questions.getQuestions(
        Number.parseInt(product_id),
        page,
        count
      );
      if (!data) {
        res.status(404).send(`There is no product with an id of ${product_id}`);
      } else {
        res.send(data);
      }
      // res.send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }, //TODO fix this

  post: async (req, res) => {
    const { body, name, email, product_id } = req.body;
    try {
      const data = await Questions.postQuestion(
        Number.parseInt(product_id),
        body,
        name,
        email
      );
      res.status(201).send();
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },

  putHelp: async (req, res) => {
    const { question_id } = req.params;
    try {
      const data = await Questions.putHelp(Number.parseInt(question_id));
      res.status(204).send();
    } catch (err) {
      res.status(400).send(err);
    }
  },
  putReport: async (req, res) => {
    const { question_id } = req.params;
    try {
      await Questions.putReport(Number.parseInt(question_id));
      res.status(204).send();
    } catch (err) {
      res.status(400).send(err);
    }
  },

  readTest: async (req, res) => {
    const { question_id } = req.params;
    try {
      const data = await Questions.readTest(Number.parseInt(question_id));
      if (!data) {
        res
          .status(404)
          .send(`There are no questions with an id of ${question_id}`);
      } else {
        res.status(200).send(data);
      }
    } catch (err) {
      res.status(404).send(err);
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

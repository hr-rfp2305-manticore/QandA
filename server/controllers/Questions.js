const { Questions } = require('../models');
// const { param } = require('../routes');

module.exports = {
  get: async (req, res) => {
    let { page, count } = req.query;
    let { product_id } = req.params;
    count = checkInput(count, 5);
    page = checkInput(page, 1);

    try {
      const { status, data } = await Questions.getQuestions(
        Number.parseInt(product_id),
        page,
        count
      );
      // if (!data) {
      //   res.status(404).send(`There is no product with an id of ${product_id}`);
      // } else {
      //   res.send(data);
      // }
      res.status(status).send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }, //TODO fix this

  post: async (req, res) => {
    const { body, name, email, product_id } = req.body;
    try {
      const { status, data } = await Questions.postQuestion(
        Number.parseInt(product_id),
        body,
        name,
        email
      );
      res.status(status).send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },

  putHelp: async (req, res) => {
    const { question_id } = req.params;
    try {
      const { status, data } = await Questions.putHelp(
        Number.parseInt(question_id)
      );
      res.status(status).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  putReport: async (req, res) => {
    const { question_id } = req.params;
    try {
      const { status, data } = await Questions.putReport(
        Number.parseInt(question_id)
      );
      res.status(status).send(data);
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

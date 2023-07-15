const { Questions } = require('../models');
// const { param } = require('../routes');

module.exports = {
  get: async (req, res) => {
    let { product_id, page, count } = req.body;
    count = checkInput(count, 5);
    page = checkInput(page, 1);

    try {
      const data = await Questions.getQuestions(
        Number.parseInt(product_id),
        page,
        count
      );
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },

  post: async (req, res) => {
    const { body, name, email, product_id } = req.body;

    console.log(body);
    console.log(name);
    console.log(email);
    console.log(product_id);
    try {
      const data = await Questions.postQuestion(
        Number.parseInt(product_id),
        body,
        name,
        email
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

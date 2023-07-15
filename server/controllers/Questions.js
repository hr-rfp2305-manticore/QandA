const { Questions } = require('../models');

module.exports = {
  get: async (req, res) => {
    try {
      const { product_id, page, count } = req.body;
      console.log(req.body);
      const data = await Questions.getQuestions(
        Number.parseInt(product_id),
        Number.parseInt(page),
        Number.parseInt(count)
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
    res.status(201).send('You are posting this');
  },
};

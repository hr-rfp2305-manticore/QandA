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
};

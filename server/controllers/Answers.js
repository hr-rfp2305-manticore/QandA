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
};

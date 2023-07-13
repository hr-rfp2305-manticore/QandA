module.exports = {
  get: async (req, res) => {
    const { params } = req;
    res.send(`Looking for question_id of ${params.question_id}? `);
  },
};

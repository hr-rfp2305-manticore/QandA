const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/questions', controllers.Questions.get);
router.get('/questions/:question_id/answers', controllers.Answers.get);

module.exports = router;

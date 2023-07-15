const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/questions', controllers.Questions.get);
router.post('/questions/', controllers.Questions.post);

router.get('/questions/:question_id/answers', controllers.Answers.get);
router.post('/questions/:question_id/answers', controllers.Answers.post);

module.exports = router;

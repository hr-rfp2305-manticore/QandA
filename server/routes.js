const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/', controllers.Questions.get);
router.post('/', controllers.Questions.post);
router.put('/:question_id/helpful', controllers.Questions.putHelp);
router.put('/:question_id/report', controllers.Questions.putReport);

router.get('/:question_id/answers', controllers.Answers.get);
router.post('/:question_id/answers', controllers.Answers.post);

module.exports = router;

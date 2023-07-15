const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/', controllers.Questions.get);
router.post('/', controllers.Questions.post);
router.put('/:question_id/helpful', controllers.Questions.putHelp);
router.put('/:question_id/report', controllers.Questions.putReport);

router.get('/:question_id/answers', controllers.Answers.get);
router.post('/:question_id/answers', controllers.Answers.post);
router.put('/answers/:answer_id/helpful', controllers.Answers.putHelp);
router.put('/answers/:answer_id/report', controllers.Answers.putReport);

module.exports = router;

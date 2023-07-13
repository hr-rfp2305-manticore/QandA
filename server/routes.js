const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/questions', controllers.Questions.get);

module.exports = router;

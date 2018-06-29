var express = require('express');
var router = express.Router();
var WordFinder = require('../api/word-finder');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Unscramble and get meaning of any word' });
});


router.get('/find', function(req, res, next) {
  res.json(WordFinder.go(req.query.word));
});

module.exports = router;

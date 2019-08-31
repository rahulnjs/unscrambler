var express = require('express');
var router = express.Router();
var WordFinder = require('../api/word-finder');
var http = require('https');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Unscramble and get meaning of any word' });
});


router.get('/find', function (req, res, next) {
  res.json(WordFinder.go(req.query.word));
});

router.get('/meaning', function (req, response, next) {

  const app_id = "c57bb63e"; 
  const app_key = "1a9ae13131f4ac704184304d37b29177";
  const wordId = req.query.word;
  const strictMatch = "true";

  const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: '/api/v2/entries/en-gb/' + wordId + '?strictMatch=' + strictMatch,
    method: "GET",
    headers: {
      'app_id': app_id,
      'app_key': app_key
    }
  };

  http.get(options, (resp) => {
    let body = '';
    resp.on('data', (d) => {
      body += d;
    });
    resp.on('end', () => {
      response.send(body);
    });
  });
});

module.exports = router;


var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(process.env["AWS_ACCESS_KEY"]);
});

module.exports = router;

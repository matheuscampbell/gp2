var express = require('express');
var router = express.Router();
var dbConf = require('../model/DbConn');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConf.makeTables();
  res.render('index', { title: 'Express' });
});

module.exports = router;

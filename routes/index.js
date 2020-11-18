var express = require('express');
var router = express.Router();
const { Book } = require('../models');
var createError = require('http-errors');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const books = await Book.findAll();
  console.log(books);
  res.json(books);
});

module.exports = router;

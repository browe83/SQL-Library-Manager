const express = require('express');

const router = express.Router();
const { Book } = require('../models');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.redirect('/books');
  // const error = new Error();
  // next(error);
})
  .get('/books', asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();
    res.render('index', { books });
  }))
  .get('/books/new', async (req, res, next) => {
    res.render('new-book');
  })
  .post('/books/new', async (req, res, next) => {
    res.render('update-book');
  })
  .get('/books/:id', async (req, res, next) => {
    res.render('update-book');
  })
  .post('/books/:id', async (req, res, next) => {
    res.render('update-book');
  })
  .post('/books/:id/delete', async (req, res, next) => {
    
  });

module.exports = router;

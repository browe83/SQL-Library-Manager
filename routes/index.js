const express = require('express');

const router = express.Router();
const { Book } = require('../models');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log('async error:', error);
      // Forward error to the global error handler
      next(error);
    }
  };
}

/* GET home page. */
router
/* GET books listing from root directory. */
  .get('/', asyncHandler(async (req, res, next) => {
    res.redirect('/books');
  }))
  /* GET books listing. */
  .get('/books', async (req, res, next) => {
    const books = await Book.findAll();
    res.render('index', { books });
  })
  /* GET a new book form. */
  .get('/books/new', async (req, res, next) => {
    res.render('new-book');
  })
  /* POST create book. */
  .post('/books/new', async (req, res, next) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect(`/books/${book.id}`);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') { // checking the error
        book = await Book.build(req.body);
        res.render('form-error', { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
/* GET an individual book by id. */
  .get('/books/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null || book === undefined) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }
    res.render('update-book', { book });
  }))
/* POST update an individual book. */
  .post('/books/:id', asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book === null || book === undefined) {
        const error = new Error('Book not found');
        error.status = 404;
        throw error;
      }
      await book.update(req.body);
      res.redirect(`/books/${book.id}`);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('form-error', { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  }))
  .post('/books/:id/delete', async (req, res, next) => {
    
  });

module.exports = router;

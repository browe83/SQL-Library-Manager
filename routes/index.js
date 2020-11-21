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
  .get('/', async (req, res, next) => {
    res.redirect('/books');
    // const error = new Error();
    // next(error);
  })
  /* GET books listing. */
  .get('/books', asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();
    res.render('index', { books });
  }))
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
        console.log('sequelize validation error:', error.errors);
        res.render('form-error', { book, errors: error.errors });
        // res.render('/books/new', { book, errors: error.errors, title: 'New Book' });
      } else {
        throw error;
      }
    }
  })
  .get('/books/:id', async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book });
  })
  .post('/books/:id', async (req, res, next) => {
    res.render('update-book');
  })
  .post('/books/:id/delete', async (req, res, next) => {
    
  });

module.exports = router;

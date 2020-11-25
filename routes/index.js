const express = require('express');

const router = express.Router();
const { Book } = require('../models');
const { Op } = require("sequelize");

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

router
/* GET books listing from root directory. */
  .get('/', asyncHandler(async (req, res, next) => {
    res.redirect('/books');
  }))
/* POST search for books. */
  .post('/books/search', asyncHandler(async (req, res, next) => {
    const { search } = req.body;
    const books = await Book.findAll({
      where: {
        [Op.or]: [{
          title: { [Op.like]: `%${search}%` },
        },
        {
          author: { [Op.like]: `%${search}%` },
        },
        {
          genre: { [Op.like]: `%${search}%` },
        },
        {
          year: { [Op.like]: `%${search}%` },
        }],
      },
      // limit: 2,
    });
    res.render('search', { books });
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
/* GET an update form to update individual book. */
  .get('/books/:id/update', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null || book === undefined) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }
    res.render('update-book', { book });
  }))
/* GET an individual book by id. */
  .get('/books/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null || book === undefined) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }
    res.render('book-details', { book });
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
/* POST delete an individual book. */
  .post('/books/:id/delete', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null || book === undefined) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }
    await book.destroy(req.body);
    res.redirect('/books/');
  }));

module.exports = router;

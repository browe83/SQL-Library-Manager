const express = require('express');

const router = express.Router();
const { Op } = require('sequelize');
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

router
/* GET books listing from root directory. */
  .get('/', asyncHandler(async (req, res, next) => {
    res.redirect('/books');
  }))
/* GET search results from paginiation links. */
  .get('/books/search/:page', asyncHandler(async (req, res, next) => {
    const pageSize = 3;
    const { page } = req.params;
    const search = req.query.term;
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
    });
    const subBooks = await Book.findAll({
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
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    res.render('search', {
      books, subBooks, pageSize, term: search,
    });
  }))
/* POST search by title, author, etc. using search bar. */
  .post('/books/search/:page', asyncHandler(async (req, res, next) => {
    const pageSize = 3;
    const { page } = req.params;
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
    });
    const subBooks = await Book.findAll({
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
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    res.render('search', {
      books, subBooks, pageSize, term: search,
    });
  }))
/* GET books listing. */
  .get('/books', asyncHandler(async (req, res, next) => {
    const pageSize = 3;
    const books = await Book.findAll();
    const subBooks = await Book.findAll({
      limit: pageSize,
    });
    res.render('index', { books, pageSize, subBooks });
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

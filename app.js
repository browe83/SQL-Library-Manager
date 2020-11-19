const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./models/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = createError(404);
  error.message = 'Page Not Found';
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.render('page-not-found', { err });
  } else {
    if (!err.message) {
      err.message = 'Oops! Looks like something went wrong!';
    }
    res.render('error', { err });
  }
});

module.exports = app;

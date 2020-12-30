var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users').router;
var profilesRouter = require('./routes/profiles');
var booksRouter = require('./routes/article');

mongoose.connect("mongodb://localhost/api",
{ useNewUrlParser: true, useUnifiedTopology: true },
(err) => {
    console.log(err ? err : "Connected");
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/books', booksRouter);

module.exports = app;
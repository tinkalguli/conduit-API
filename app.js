var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users').router;
var profilesRouter = require('./routes/profiles').router;
var articlesRouter = require('./routes/articles');

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
app.use('/api/articles', articlesRouter);

app.use((req, res, next) => {
    return res.status(404).json({ errors: { body : [ "Page not found" ]}});
});

app.use((error, req, res, next) => {
    return res.status(500).json({ errors: { body : [ error.toString() ]}});
});

module.exports = app;

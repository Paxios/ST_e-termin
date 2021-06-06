require('dotenv').config();
const mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const database_models = require("./database/models")
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.exvcj.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var servicesRouter = require('./routes/services');
var receiptsRouter = require('./routes/receipts');
var reportsRouter = require('./routes/reports');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/storitev', servicesRouter);
app.use('/racun', receiptsRouter);
app.use('/porocilo', reportsRouter);

module.exports = app;

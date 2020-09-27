//set environment
require('custom-env').env();
//set config in global var
global.config = require('./config/config.js');
if (process.env.IS_DOCKER.toUpperCase() === "TRUE") {
  config.database.host = "mongodb";
}
//load all models in global variable
global.db = require('./models');
const {
  commonMiddelware
} = require("./common/middleware");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session'); //Create a session middleware
const flash = require('connect-flash');
var cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

/**
 * Loading Handlebar template and custom helpers
 */
const hbs = exphbs.create(require('./helpers/handlebar.js'));
// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
//express session
app.use(session(config.session));
//use connect flash
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(commonMiddelware);
app.use('/', indexRouter);
console.log("Server started!");
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
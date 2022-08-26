require("dotenv").config(); 
var express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:{
    origin:'http://localhost:3000',
    credentials: true,
  },
  cookie: true,
  
});

module.exports = {app,httpServer,io};

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  optionSuccessStatus:200,
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['*', 'Authorization', ]
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
mongoose.connect(
  process.env.MONGODB_URL, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
).then(()=>{console.log("Sucessfully connected!!!")});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




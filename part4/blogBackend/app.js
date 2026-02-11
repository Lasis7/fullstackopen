const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();

const mongoUrl = config.MONGODB_URI;
// family refers to IP type the function will try, here IPv4 is defined
mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message);
  });

// JSON-parser is registered first, then two utility middlewares, then routes and finally errorhandler-middleware
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorLogger);

module.exports = app;

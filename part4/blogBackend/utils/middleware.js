const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('---');
  }
  next();
};

const errorLogger = (error, request, response, next) => {
  // console.log(error.stack);
  // If the id format is wrong on request route (for example 1 is not MongoDb ObjectId)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
    // Schema validation error, for example if a username length requirement is 3 and the typed username's length is 2
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
    // If username field is marked as unique and it already exists
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
    // Token verifying fails
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  next(error);
};

// Extracts token from the authorization header and sets it to request as a property
const tokenExtractor = (request, response, next) => {
  // Get authorization header from request-object
  const authorization = request.get('authorization');
  // Check if header that starts with Bearer exists and replace that part with an empty string to get the token
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    request.token = token;
  }
  next();
};

// Extracts user using the token acquired with tokenExtractor
const userExtractor = async (request, response, next) => {
  // If token missing
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }
  // User is decoded by verifying the token with the secret
  const decodedUser = jwt.verify(request.token, process.env.SECRET);
  // console.log('hi', decodedUser);
  // Check if id exists
  if (!decodedUser.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  // User is searched from documents
  const user = await User.findById(decodedUser.id);
  request.user = user;
  next();
};

module.exports = { requestLogger, errorLogger, tokenExtractor, userExtractor };

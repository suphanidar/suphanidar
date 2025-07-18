const mongoose = require(‘mongoose’);
const logger = require(’../utils/logger’);

// Custom error class
class AppError extends Error {
constructor(message, statusCode, isOperational = true) {
super(message);
this.statusCode = statusCode;
this.isOperational = isOperational;
this.status = `${statusCode}`.startsWith(‘4’) ? ‘fail’ : ‘error’;

```
Error.captureStackTrace(this, this.constructor);
```

}
}

// Handle MongoDB cast errors
const handleCastErrorDB = (err) => {
const message = `Invalid ${err.path}: ${err.value}`;
return new AppError(message, 400);
};

// Handle MongoDB duplicate field errors
const handleDuplicateFieldsDB = (err) => {
const value = err.errmsg ? err.errmsg.match(/([”’])(\?.)*?\1/)[0] : ‘unknown’;
const message = `Duplicate field value: ${value}. Please use another value!`;
return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationErrorDB = (err) => {
const errors = Object.values(err.errors).map(el => el.message);
const message = `Invalid input data. ${errors.join('. ')}`;
return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
new AppError(‘Invalid token. Please log in again!’, 401);

const handleJWTExpiredError = () =>
new AppError(‘Your token has expired! Please log in again.’, 401);

// Handle Multer errors
const handleMulterError = (err) => {
if (err.code === ‘LIMIT_FILE_SIZE’) {
return new AppError(‘File too large. Please upload a smaller file.’, 400);
}
if (err.code === ‘LIMIT_FILE_COUNT’) {
return new AppError(‘Too many files. Please upload fewer files.’, 400);
}
if (err.code === ‘LIMIT_UNEXPECTED_FILE’) {
return new AppError(‘Unexpected file field. Please check your file upload.’, 400);
}
return new AppError(‘File upload error. Please try again.’, 400);
};

// Send error response for development
const sendErrorDev = (err, req, res) => {
// Log error
logger.error(‘Error 💥:’, {
error: err,
stack: err.stack,
url: req.originalUrl,
method: req.method,
ip: req.ip,
userAgent: req.get(‘User-Agent’)
});

// API error
if (req.originalUrl.startsWith(’/api’)) {
return res.status(err.statusCode).json({
status: err.status,
error: err,
message: err.message,
stack: err.stack,
timestamp: new Date().toISOString(),
path: req.originalUrl,
method: req.method
});
}

// Rendered website error
return res.status(err.statusCode).render(‘error’, {
title: ‘Something went wrong!’,
msg: err.message
});
};

// Send error response for production
const sendErrorProd = (err, req, res) => {
// Log error
if (!err.isOperational) {
logger.error(‘Programming Error 💥:’, {
error: err,
stack: err.stack,
url: req.originalUrl,
method: req.method,
ip: req.ip
});
}

// API error
if (req.originalUrl.startsWith(’/api’)) {
// Operational, trusted error: send message to client
if (err.isOperational) {
return res.status(err.statusCode).json({
status: err.status,
message: err.message,
timestamp: new Date().toISOString()
});
}

```
// Programming or other unknown error: don't leak error details
return res.status(500).json({
  status: 'error',
  message: 'Something went wrong!',
  timestamp: new Date().toISOString()
});
```

}

// Rendered website error
if (err.isOperational) {
return res.status(err.statusCode).render(‘error’, {
title: ‘Something went wrong!’,
msg: err.message
});
}

// Programming or other unknown error: don’t leak error details
return res.status(err.statusCode).render(‘error’, {
title: ‘Something went wrong!’,
msg: ‘Please try again later.’
});
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
err.statusCode = err.statusCode || 500;
err.status = err.status || ‘error’;

if (process.env.NODE_ENV === ‘development’) {
sendErrorDev(err, req, res);
} else {
let error = { …err };
error.message = err.message;

```
// Handle different types of errors
if (error.name === 'CastError') error = handleCastErrorDB(error);
if (error.code === 11000) error = handleDuplicateFieldsDB(error);
if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
if (error.name === 'JsonWebTokenError') error = handleJWTError();
if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
if (error.name === 'MulterError') error = handleMulterError(error);

sendErrorProd(error, req, res);
```

}
};

// 404 handler
const notFound = (req, res, next) => {
const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
next(err);
};

// Async error wrapper
const catchAsync = (fn) => {
return (req, res, next) => {
fn(req, res, next).catch(next);
};
};

// Validation error handler
const validationErrorHandler = (errors) => {
const errorMessages = errors.array().map(error => ({
field: error.param,
message: error.msg,
value: error.value
}));

return new AppError(‘Validation Error’, 400, true, errorMessages);
};

// Rate limit error handler
const rateLimitHandler = (req, res) => {
const error = new AppError(‘Too many requests from this IP, please try again later.’, 429);

res.status(error.statusCode).json({
status: error.status,
message: error.message,
retryAfter: Math.round(req.rateLimit.resetTime / 1000) || 60,
timestamp: new Date().toISOString()
});
};

// Database connection error handler
const handleDatabaseError = (err) => {
logger.error(‘Database connection error:’, err);

if (err.name === ‘MongoNetworkError’) {
return new AppError(‘Database connection failed. Please try again later.’, 503);
}

if (err.name === ‘MongoTimeoutError’) {
return new AppError(‘Database operation timed out. Please try again.’, 503);
}

return new AppError(‘Database error occurred.’, 500);
};

// File processing error handler
const handleFileProcessingError = (err) => {
logger.error(‘File processing error:’, err);

if (err.message.includes(‘unsupported format’)) {
return new AppError(‘Unsupported file format. Please upload a valid image.’, 400);
}

if (err.message.includes(‘corrupted’)) {
return new AppError(‘File appears to be corrupted. Please try a different file.’, 400);
}

return new AppError(‘File processing failed. Please try again.’, 500);
};

// AI processing error handler
const handleAIProcessingError = (err) => {
logger.error(‘AI processing error:’, err);

if (err.message.includes(‘model not loaded’)) {
return new AppError(‘AI model is currently unavailable. Please try again later.’, 503);
}

if (err.message.includes(‘inference timeout’)) {
return new AppError(‘AI processing timed out. Please try with a smaller image.’, 408);
}

return new AppError(‘AI processing failed. Please try again.’, 500);
};

// Health check error handler
const healthCheckError = (service, error) => {
logger.error(`Health check failed for ${service}:`, error);
return {
service,
status: ‘unhealthy’,
error: error.message,
timestamp: new Date().toISOString()
};
};

// Security error handler
const handleSecurityError = (err, req) => {
logger.warn(‘Security violation detected:’, {
error: err.message,
ip: req.ip,
userAgent: req.get(‘User-Agent’),
url: req.originalUrl,
method: req.method
});

return new AppError(‘Security violation detected.’, 403);
};

module.exports = {
AppError,
globalErrorHandler,
notFound,
catchAsync,
validationErrorHandler,
rateLimitHandler,
handleDatabaseError,
handleFileProcessingError,
handleAIProcessingError,
healthCheckError,
handleSecurityError
};
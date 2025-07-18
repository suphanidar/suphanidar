const jwt = require(‘jsonwebtoken’);
const { promisify } = require(‘util’);
const User = require(’../models/User’);
const { AppError, catchAsync } = require(’./errorHandler’);
const logger = require(’../utils/logger’);

// Generate JWT token
const signToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRE,
});
};

// Generate refresh token
const signRefreshToken = (id) => {
return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
expiresIn: process.env.JWT_REFRESH_EXPIRE,
});
};

// Create and send JWT token response
const createSendToken = (user, statusCode, req, res, message = ‘Success’) => {
const token = signToken(user._id);
const refreshToken = signRefreshToken(user._id);

const cookieOptions = {
expires: new Date(
Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
),
httpOnly: true,
secure: req.secure || req.headers[‘x-forwarded-proto’] === ‘https’,
sameSite: ‘lax’
};

// Set secure cookie in production
if (process.env.NODE_ENV === ‘production’) {
cookieOptions.secure = true;
}

res.cookie(‘jwt’, token, cookieOptions);
res.cookie(‘refreshToken’, refreshToken, {
…cookieOptions,
expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
});

// Remove password from output
user.password = undefined;

res.status(statusCode).json({
status: ‘success’,
message,
token,
refreshToken,
user: {
id: user._id,
username: user.username,
email: user.email,
avatar: user.avatar,
stats: user.stats,
profile: user.profile,
isVerified: user.isVerified,
createdAt: user.createdAt
}
});
};

// Protect routes - require authentication
const protect = catchAsync(async (req, res, next) => {
// 1) Getting token and check if it’s there
let token;

if (req.headers.authorization && req.headers.authorization.startsWith(‘Bearer’)) {
token = req.headers.authorization.split(’ ’)[1];
} else if (req.cookies.jwt) {
token = req.cookies.jwt;
}

if (!token) {
return next(
new AppError(‘You are not logged in! Please log in to get access.’, 401)
);
}

// 2) Verification of token
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

// 3) Check if user still exists
const currentUser = await User.findById(decoded.id).select(’+active’);
if (!currentUser) {
return next(
new AppError(‘The user belonging to this token does no longer exist.’, 401)
);
}

// 4) Check if user is active
if (!currentUser.isActive) {
return next(new AppError(‘Your account has been deactivated.’, 401));
}

// 5) Check if user changed password after the token was issued
if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
return next(
new AppError(‘User recently changed password! Please log in again.’, 401)
);
}

// Grant access to protected route
req.user = currentUser;
res.locals.user = currentUser;
next();
});

// Only for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
if (req.cookies.jwt) {
try {
// 1) Verify token
const decoded = await promisify(jwt.verify)(
req.cookies.jwt,
process.env.JWT_SECRET
);

```
  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }

  // 3) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next();
  }

  // There is a logged in user
  res.locals.user = currentUser;
  req.user = currentUser;
  return next();
} catch (error) {
  return next();
}
```

}
next();
};

// Restrict access to certain roles
const restrictTo = (…roles) => {
return (req, res, next) => {
if (!roles.includes(req.user.role)) {
return next(
new AppError(‘You do not have permission to perform this action’, 403)
);
}
next();
};
};

// Check if user owns the resource or is admin
const checkOwnership = (Model, resourceIdParam = ‘id’) => {
return catchAsync(async (req, res, next) => {
const resourceId = req.params[resourceIdParam];
const resource = await Model.findById(resourceId);

```
if (!resource) {
  return next(new AppError('Resource not found', 404));
}

// Check if user owns the resource or is admin
if (resource.userId?.toString() !== req.user._id.toString() && 
    req.user.role !== 'admin') {
  return next(
    new AppError('You do not have permission to access this resource', 403)
  );
}

req.resource = resource;
next();
```

});
};

// Refresh token middleware
const refreshToken = catchAsync(async (req, res, next) => {
let refreshToken;

// Get refresh token from cookie or header
if (req.cookies.refreshToken) {
refreshToken = req.cookies.refreshToken;
} else if (req.headers[‘x-refresh-token’]) {
refreshToken = req.headers[‘x-refresh-token’];
}

if (!refreshToken) {
return next(new AppError(‘Refresh token not provided’, 401));
}

// Verify refresh token
const decoded = await promisify(jwt.verify)(
refreshToken,
process.env.JWT_REFRESH_SECRET
);

// Check if user still exists
const currentUser = await User.findById(decoded.id);
if (!currentUser) {
return next(new AppError(‘User no longer exists’, 401));
}

// Check if user is active
if (!currentUser.isActive) {
return next(new AppError(‘User account is deactivated’, 401));
}

// Generate new tokens
createSendToken(currentUser, 200, req, res, ‘Token refreshed successfully’);
});

// Logout user
const logout = (req, res) => {
res.cookie(‘jwt’, ‘loggedout’, {
expires: new Date(Date.now() + 10 * 1000),
httpOnly: true
});
res.cookie(‘refreshToken’, ‘loggedout’, {
expires: new Date(Date.now() + 10 * 1000),
httpOnly: true
});

res.status(200).json({
status: ‘success’,
message: ‘Logged out successfully’
});
};

// Check rate limiting for sensitive operations
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
const attempts = new Map();

return (req, res, next) => {
const key = `${req.ip}:${req.user?._id || 'anonymous'}`;
const now = Date.now();
const userAttempts = attempts.get(key) || { count: 0, resetTime: now + windowMs };

```
// Reset if window has passed
if (now > userAttempts.resetTime) {
  userAttempts.count = 0;
  userAttempts.resetTime = now + windowMs;
}

// Check if limit exceeded
if (userAttempts.count >= maxAttempts) {
  return next(
    new AppError(
      `Too many attempts. Please try again in ${Math.ceil((userAttempts.resetTime - now) / 60000)} minutes.`,
      429
    )
  );
}

// Increment counter
userAttempts.count++;
attempts.set(key, userAttempts);

next();
```

};
};

// API key authentication for external services
const authenticateApiKey = catchAsync(async (req, res, next) => {
const apiKey = req.headers[‘x-api-key’];

if (!apiKey) {
return next(new AppError(‘API key required’, 401));
}

// Validate API key (could be stored in database or env)
const validApiKeys = process.env.VALID_API_KEYS?.split(’,’) || [];

if (!validApiKeys.includes(apiKey)) {
logger.warn(‘Invalid API key attempt:’, {
apiKey: apiKey.substring(0, 8) + ‘…’,
ip: req.ip,
userAgent: req.get(‘User-Agent’)
});
return next(new AppError(‘Invalid API key’, 401));
}

req.apiAuthenticated = true;
next();
});

// Two-factor authentication check
const requireTwoFactor = catchAsync(async (req, res, next) => {
if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
return next(
new AppError(‘Two-factor authentication required’, 403)
);
}
next();
});

// Device fingerprinting for security
const checkDeviceFingerprint = (req, res, next) => {
const fingerprint = {
userAgent: req.get(‘User-Agent’),
acceptLanguage: req.get(‘Accept-Language’),
acceptEncoding: req.get(‘Accept-Encoding’),
ip: req.ip
};

// Store fingerprint in session for comparison
req.deviceFingerprint = fingerprint;
next();
};

// Log authentication events
const logAuthEvent = (event, req, user = null) => {
logger.info(‘Authentication event:’, {
event,
userId: user?._id,
username: user?.username,
ip: req.ip,
userAgent: req.get(‘User-Agent’),
timestamp: new Date().toISOString()
});
};

module.exports = {
signToken,
signRefreshToken,
createSendToken,
protect,
isLoggedIn,
restrictTo,
checkOwnership,
refreshToken,
logout,
sensitiveOperationLimit,
authenticateApiKey,
requireTwoFactor,
checkDeviceFingerprint,
logAuthEvent
};
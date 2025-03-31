const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log('Auth middleware - Headers:', req.headers);

  // Try to get token from x-auth-token header
  let token = req.header('x-auth-token');

  // If not found, try Authorization header with Bearer token
  if (!token) {
    const authHeader = req.header('Authorization');
    console.log('No x-auth-token, checking Authorization header:', authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Found Bearer token:', token ? 'Yes' : 'No');
    }
  }

  if (!token) {
    console.log('No token found in any header');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Attempting to verify token');
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Token verified successfully, decoded content:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};

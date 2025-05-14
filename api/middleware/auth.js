const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Try to get token from x-auth-token header
  let token = req.header('x-auth-token');

  // If not found, try Authorization header with Bearer token
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};

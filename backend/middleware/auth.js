const jwt = require('jsonwebtoken');
const SECRET = 'secret123';

module.exports = (req) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      return null;
    }
  }
  return null;
};

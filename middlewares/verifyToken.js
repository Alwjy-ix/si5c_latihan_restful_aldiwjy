const jwt = require('jsonwebtoken');
const { errorHttp } = require('./errorHandler');

function verifyToken(req, res, next) {
  const [skema, token] = (req.headers.authorization || '').split(' ');
  if (skema !== 'Bearer' || !token) {
    throw errorHttp(401, 'Token tidak ditemukan');
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    const pesan = err.name === 'TokenExpiredError' ? 'Token kedaluwarsa' : 'Token tidak valid';
    throw errorHttp(401, pesan);
  }
}

module.exports = verifyToken;
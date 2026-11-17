const { errorHttp } = require('./errorHandler');

// Membuat middleware yang hanya meloloskan peran tertentu.
// Dipasang SETELAH verifyToken, karena membaca req.user.
function hanyaRole(...roleDiizinkan) {
  return (req, res, next) => {
    if (!req.user || !roleDiizinkan.includes(req.user.role)) {
      throw errorHttp(403, 'Akses ditolak: peran Anda tidak diizinkan');
    }
    next();
  };
}

module.exports = hanyaRole;
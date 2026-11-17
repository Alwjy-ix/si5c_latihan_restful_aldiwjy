// const express = require('express');
// const router = express.Router();
// const mahasiswaController = require('../controllers/mahasiswaController');
// const cekApiKey = require('../middlewares/cekApiKey');

// router.get('/', mahasiswaController.getAll);
// router.get('/:id', mahasiswaController.getById);
// router.post('/', cekApiKey, mahasiswaController.create);
// router.put('/:id', cekApiKey, mahasiswaController.update);
// router.delete('/:id', cekApiKey, mahasiswaController.remove);

// module.exports = router;

const express = require('express');
const router = express.Router();
const c = require('../controllers/mahasiswaController');
// const cekApiKey = require('../middlewares/cekApiKey');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

// Publik
router.get('/', c.getAll);
router.get('/:id', c.getById);

// user dan admin
router.post('/', verifyToken, hanyaRole('user', 'admin'), c.create);
router.put('/:id', verifyToken, hanyaRole('user', 'admin'), c.update);

// admin saja
router.delete('/:id', verifyToken, hanyaRole('admin'), c.remove);

module.exports = router;
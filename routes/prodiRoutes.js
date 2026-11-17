// const express = require('express');
// const router = express.Router();
// const prodiController = require('../controllers/prodiController');
// const cekApiKey = require('../middlewares/cekApiKey');

// router.get('/', prodiController.getAll);
// router.get('/:id', prodiController.getById);
// router.post('/', cekApiKey, prodiController.create);

// module.exports = router;

const express = require('express');
const router = express.Router();
const c = require('../controllers/prodiController');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

router.get('/', c.getAll);
router.post('/', verifyToken, hanyaRole('admin'), c.create);

module.exports = router;
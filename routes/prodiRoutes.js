const express = require('express');
const router = express.Router();
const prodiController = require('../controllers/prodiController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', prodiController.getAll);
router.get('/:id', prodiController.getById);
router.post('/', cekApiKey, prodiController.create);

module.exports = router;
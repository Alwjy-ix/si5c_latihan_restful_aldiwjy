const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', mahasiswaController.getAll);
router.get('/:id', mahasiswaController.getById);
router.post('/', cekApiKey, mahasiswaController.create);
router.put('/:id', cekApiKey, mahasiswaController.update);
router.delete('/:id', cekApiKey, mahasiswaController.remove);

module.exports = router;
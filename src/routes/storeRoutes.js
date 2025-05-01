const express = require('express');
const storeController = require('../controllers/storeController');
const router = express.Router();

router.get('/getAll', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.post('/create', storeController.createStore);
router.put('/', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;

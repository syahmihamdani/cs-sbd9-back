const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/create', transactionController.createTransaction);
router.post('/pay', transactionController.payTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/', transactionController.getTransactions);

module.exports = router;

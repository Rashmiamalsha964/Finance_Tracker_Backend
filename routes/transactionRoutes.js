const express = require('express');
const router = express.Router();
const {updateTransaction, getTransaction, createTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes so they are secure
router.route('/')
  .get(protect, getTransaction)
  .post(protect, createTransaction);

router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);
  

module.exports = router;
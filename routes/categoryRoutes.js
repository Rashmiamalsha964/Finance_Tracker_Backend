const express = require('express');
const router = express.Router();
// Import the new updateCategory function!
const { getCategories, createCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCategories)
  .post(protect, createCategory);

// Add the .put() method to the ID route
router.route('/:id')
  .put(protect, updateCategory) 
  .delete(protect, deleteCategory);

module.exports = router;
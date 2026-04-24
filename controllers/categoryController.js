const Category = require('../models/Category');
const getCategories = async (req, res) => {
  try {
    // Find all categories that belong to the logged-in user
    const categories = await Category.find({ user: req.user._id });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Please provide a name and type (income/expense)' });
    }

    // Create the category and attach the logged-in user's ID
    const category = await Category.create({
      name,
      type,
      user: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure the logged-in user owns this category before deleting
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this category' });
    }

    await category.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure the logged-in user owns this category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this category' });
    }

    // Update the fields
    category.name = req.body.name || category.name;
    category.type = req.body.type || category.type;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
};
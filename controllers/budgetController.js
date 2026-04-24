const Budget = require('../models/Budget');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).populate('category', 'name type');
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ message: 'Please provide a category and amount' });
    }

    // Check if a budget already exists for this category
    const budgetExists = await Budget.findOne({ user: req.user._id, category });
    if (budgetExists) {
      return res.status(400).json({ message: 'A budget already exists for this category. Please edit it instead.' });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      period: period || 'monthly',
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await budget.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
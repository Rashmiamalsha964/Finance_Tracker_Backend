const Transaction = require('../models/Transaction');

// @desc    Get all Transactions for a user
// @route   GET /api/transaction
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Base query (only logged-in user)
    let query = { user: req.user._id };

    // Filters
    if (type) query.type = type;
    if (category) query.category = category;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // 🔥 FIXED (renamed variable)
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate('category', 'name type');

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// @desc    Create a new transaction
// @route   POST /api/transaction
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    // Validation
    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        message: 'Please provide title, amount, type, and category',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      note,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// @desc    Update a transaction
// @route   PUT /api/transaction/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// @desc    Delete a transaction
// @route   DELETE /api/transaction/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: 'Transaction deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// ✅ Export all
module.exports = {
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
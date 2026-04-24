const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    amount: {
      type: Number,
      required: [true, 'Please add a budget limit amount'],
    },
    period: {
      type: String,
      default: 'monthly', // The assignment recommends Monthly
      enum: ['weekly', 'monthly', 'yearly'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Budget', budgetSchema);
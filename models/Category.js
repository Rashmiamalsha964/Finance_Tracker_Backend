const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links this category to a specific user
    },
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify if this is for income or expense'],
      enum: ['income', 'expense'], // Forces the value to be one of these two
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
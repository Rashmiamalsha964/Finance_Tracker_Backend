const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 Get all transactions (with category names)
    const transactions = await Transaction.find({ user: userId })
      .populate('category', 'name type');

    // =============================
    // ✅ 1. SUMMARY
    // =============================
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      else expenses += tx.amount;
    });

    const balance = income - expenses;

    // =============================
    // ✅ 2. MONTHLY DATA (Bar Chart)
    // =============================
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString('default', {
        month: 'short',
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        monthlyMap[month].income += tx.amount;
      } else {
        monthlyMap[month].expense += tx.amount;
      }
    });

    const monthlyData = Object.values(monthlyMap);

    // =============================
    // ✅ 3. CATEGORY DATA (Pie Chart)
    // =============================
    const categoryMap = {};

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const name = tx.category?.name || 'Other';

        if (!categoryMap[name]) {
          categoryMap[name] = 0;
        }

        categoryMap[name] += tx.amount;
      }
    });

    const categoryData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    // =============================
    // ✅ 4. RECENT TRANSACTIONS
    // =============================
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .populate('category', 'name');

    // =============================
    // ✅ 5. BUDGET USAGE
    // =============================
    const budgets = await Budget.find({ user: userId });

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    const budgetUsagePercent =
      totalBudget > 0 ? (expenses / totalBudget) * 100 : 0;

    // =============================
    // ✅ FINAL RESPONSE
    // =============================
    res.status(200).json({
      summary: {
        balance,
        income,
        expenses,
        budgetLimit: totalBudget,
        budgetUsagePercent,
      },
      monthlyData,
      categoryData,
      recentTransactions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/userModel');

const getDashboardStats = async (req, res) => {
  try {
    // Total number of orders
    const totalOrders = await Order.countDocuments();

    // Total number of products
    const totalProducts = await Product.countDocuments();

    // Total number of users
    const totalUsers = await User.countDocuments();

    //pending orders
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Total earnings from all orders
    const totalEarningsData = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Completed"] } } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalEarnings = totalEarningsData[0]?.totalEarnings || 0;

    // Monthly earnings for the last 12 months
    const monthlyEarningsData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyTotal: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
      {
        $project: {
          _id: 1, // keep year and month
          monthlyTotal: 1,
        },
      },
    ]);

    // Convert month numbers → month names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyEarnings = monthlyEarningsData.map(item => ({
      month: `${monthNames[item._id.month - 1]}-${item._id.year}`,
      monthlyTotal: item.monthlyTotal,
    })).reverse();

    // Monthly orders count (last 12 months)
    const monthlyOrdersData = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Completed"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    const monthlyOrders = monthlyOrdersData.map(item => ({
      month: `${monthNames[item._id.month - 1]}-${item._id.year}`,
      ordersCount: item.ordersCount
    })).reverse();

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalEarnings,
      monthlyEarnings,
      notifications: {        
        pendingOrders,
      },
      monthlyOrders
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

const getSalesOverTime = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          totalSales: 1,
          orderCount: 1,
        },
      },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales over time:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { getDashboardStats, getSalesOverTime };
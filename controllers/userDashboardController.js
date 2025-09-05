const User = require('../models/userModel');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');

const normalizeStatus = (status) => {
  const mapping = {
    pending: "processing",
    in_progress: "processing",
    processing: "processing",
    shipped: "shipped",
    out_for_delivery: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return mapping[status?.toLowerCase()] || "processing"; // default
};

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware (JWT)

    // Pagination
    const limit = parseInt(req.query.limit) || 3;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Fetch user
    const user = await User.findById(userId).select("name email").lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Quick stats
    const [ordersCount, wishlist, cart] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Wishlist.findOne({ userId }).select("products").lean(),
      Cart.findOne({ user: userId }).select("items").lean(),
    ]);

    const wishlistCount = wishlist ? wishlist.products.length : 0;
    const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0): 0; // ✅ total quantity

    // Recent orders with status normalization
    const [recentOrders, totalOrders] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("orderNumber status createdAt totalAmount")
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

    // Apply normalization
    const normalizedOrders = recentOrders.map((order) => ({
      ...order,
      status: normalizeStatus(order.status),
    }));

    res.json({
      success: true,
      data: {
        user,
        quickStats: {
          ordersCount,
          wishlistCount,
          cartCount,
        },
        recentOrders: {
          list: normalizedOrders,
          pagination: {
            total: totalOrders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit),
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching user dashboard:", err);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

module.exports = {
  getUserDashboard,
};

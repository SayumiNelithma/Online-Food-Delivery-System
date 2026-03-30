const axios = require("axios");
const Order = require("../models/Order");

const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL ||
  process.env.GATEWAY_URL ||
  process.env.API_GATEWAY ||
  process.env.APIGW_URL ||
  "http://localhost:8000";

const axiosInstance = axios.create({ timeout: 5000 });

// POST /orders
const createOrder = async (req, res) => {
  try {
    const {
      customer_id,
      restaurant_id,
      customer_name,
      customer_phone,
      order_date,
      total_price,
      status,
      items
    } = req.body;

    if (!customer_id || !restaurant_id || !items || items.length === 0) {
      return res.status(400).json({
        message: "customer_id, restaurant_id, and items are required"
      });
    }

    const customerResponse = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/customers/${customer_id}`
    );

    const restaurantResponse = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/restaurants/${restaurant_id}`
    );

    if (!customerResponse.data) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!restaurantResponse.data) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let calculatedTotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const menuId = item.menu_id || item.item_id || item._id;
      let genuinePrice = item.price || 0;
      let genuineName = item.item_name || item.name;

      if (menuId) {
        try {
          const menuResp = await axiosInstance.get(
            `${API_GATEWAY_URL}/api/menus/${menuId}`
          );
          if (menuResp.data && menuResp.data.restaurant_id === restaurant_id) {
            genuinePrice = menuResp.data.price;
            genuineName = menuResp.data.item_name;
          } else if (menuResp.data && menuResp.data.restaurant_id !== restaurant_id) {
            return res.status(400).json({ message: `Menu item ${menuId} does not belong to this restaurant` });
          }
        } catch (err) {
          console.error(`Could not fetch menu item ${menuId}:`, err.message);
          return res.status(400).json({ message: `Invalid menu item: ${menuId}` });
        }
      }

      const quantity = item.quantity || 1;
      calculatedTotal += genuinePrice * quantity;

      enrichedItems.push({
        ...item,
        menu_id: menuId,
        item_name: genuineName,
        price: genuinePrice,
        quantity
      });
    }

    const finalTotal =
      total_price !== undefined ? total_price : calculatedTotal;

    const order = await Order.create({
      customer_id,
      customer_name:
        customer_name || customerResponse.data.customer_name || customerResponse.data.name,
      customer_phone:
        customer_phone || customerResponse.data.customer_phone || customerResponse.data.phone,
      restaurant_id,
      restaurant_name:
        restaurantResponse.data.restaurant_name || restaurantResponse.data.name,
      order_date: order_date || new Date(),
      total_price: finalTotal,
      status: status || "CREATED",
      items: enrichedItems
    });

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("createOrder error:", error.message);

    if (error.response && error.response.status === 404) {
      if (error.config?.url?.includes("/customers/")) {
        return res.status(404).json({ message: "Customer not found" });
      }
      if (error.config?.url?.includes("/restaurants/")) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

// GET /orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("getOrderById error:", error.message);
    res.status(500).json({ message: "Failed to get order" });
  }
};

// GET /orders/user/:userId
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error("getOrdersByUser error:", error.message);
    res.status(500).json({ message: "Failed to get user orders" });
  }
};

// GET /orders/restaurant/:restaurant_id
const getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant_id: req.params.restaurant_id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("getOrdersByRestaurant error:", error.message);
    res.status(500).json({ message: "Failed to get restaurant orders" });
  }
};

// PUT /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// GET /orders/:id/payments
const getOrderPayments = async (req, res) => {
  try {
    const paymentResp = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/payments/order/${req.params.id}`
    );

    res.status(200).json(paymentResp.data);
  } catch (error) {
    console.error("getOrderPayments error:", error.message);

    if (error.response && error.response.status) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ message: "Failed to fetch order payments" });
  }
};

// POST /orders/:id/refund
const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentsResp = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/payments/order/${req.params.id}`
    );

    const payments = paymentsResp.data;
    const successfulPayment = payments.find(
      (payment) => payment.status === "SUCCESS"
    );

    if (!successfulPayment) {
      return res.status(400).json({
        message: "No successful payment found to refund"
      });
    }

    const refundResp = await axiosInstance.post(
      `${API_GATEWAY_URL}/api/payments/refund`,
      {
        paymentId: successfulPayment.paymentId
      }
    );

    res.status(200).json({
      message: "Order refunded",
      refund: refundResp.data.payment
    });
  } catch (error) {
    console.error("refundOrder error:", error.message);

    if (error.response && error.response.status) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ message: "Failed to refund order" });
  }
};

// PUT /orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    const previousStatus = order.status;
    order.status = "CANCELLED";
    await order.save();

    if (previousStatus === "PAID") {
      try {
        const paymentsResp = await axiosInstance.get(
          `${API_GATEWAY_URL}/api/payments/order/${req.params.id}`
        );

        const successfulPayment = paymentsResp.data.find(
          (payment) => payment.status === "SUCCESS"
        );

        if (successfulPayment) {
          await axiosInstance.post(`${API_GATEWAY_URL}/api/payments/refund`, {
            paymentId: successfulPayment.paymentId
          });
        }
      } catch (refundErr) {
        console.error(
          "Failed to process automatic refund during cancellation:",
          refundErr.message
        );
      }
    }

    res.status(200).json({
      message: "Order cancelled",
      order
    });
  } catch (error) {
    console.error("cancelOrder error:", error.message);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  getOrdersByRestaurant,
  updateOrderStatus,
  getOrderPayments,
  refundOrder,
  cancelOrder
};
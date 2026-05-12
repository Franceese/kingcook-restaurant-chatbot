const Session = require("../models/Session");
const menu = require("../services/menu");
const axios = require("axios");

exports.chatBot = async (req, res) => {

  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({
      reply: "Message is required"
    });
  }

  let session = await Session.findOne({ sessionId });

  if (!session) {
    session = await Session.create({
      sessionId,
      currentOrder: [],
      orderHistory: []
    });
  }

  switch (message) {

    case "menu":

      return res.json({
        reply:
`Welcome to Naija Kitchen 🍲

1 → Place an order
97 → Current order
98 → Order history
99 → Checkout order
0 → Cancel order`
      });

    case "1":

      return res.json({
        reply: menu.map(
          item =>
          `${item.id} → ${item.name} — ₦${item.price}`
        ).join("\n")
      });

    case "97":

      if (!session.currentOrder.length) {
        return res.json({
          reply: "No current order"
        });
      }

      return res.json({
       reply:
"🛒 Current Order:\n\n" +

session.currentOrder
  .map(
    item =>
    `• ${item.name} - ₦${item.price}`
  )
  .join("\n")
      });

    case "98":

      if (!session.orderHistory.length) {
        return res.json({
          reply: "No order history"
        });
      }

      return res.json({
        reply: session.orderHistory
          .map(
            order =>
            `₦${order.totalAmount} - ${order.status}`
          )
          .join("\n")
      });

    case "0":

      session.currentOrder = [];

      await session.save();

      return res.json({
        reply: "Order cancelled"
      });

    case "99":

      if (!session.currentOrder.length) {
        return res.json({
          reply: "No order to place"
        });
      }

      const total = session.currentOrder.reduce(
        (sum, item) => sum + item.price,
        0
      );

      return res.json({
        reply: `Order placed. Total = ₦${total}`,
        total
      });

    default:

      const selectedItem = menu.find(
        item => item.id === Number(message)
      );

      if (!selectedItem) {
        return res.json({
          reply: "Invalid option selected"
        });
      }

      session.currentOrder.push(selectedItem);

      await session.save();

      return res.json({
        reply: `${selectedItem.name} added successfully`
      });
  }
};

exports.initializePayment = async (req, res) => {

  const { email, amount } = req.body;

  try {

    const response = await axios.post(

      "https://api.paystack.co/transaction/initialize",

      {
        email,

        amount: amount * 100,

        callback_url:
        "https://kingcook-restaurant-chatbot.onrender.com/payment-success"
      },

      {
        headers: {
          Authorization:
          `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Payment initialization failed"
    });
  }
};

exports.verifyPayment = async (req, res) => {

  const { reference } = req.params;

  try {

    const response = await axios.get(

      `https://api.paystack.co/transaction/verify/${reference}`,

      {
        headers: {
          Authorization:
          `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.verifyAndSavePayment = async (req, res) => {

  const {
    reference,
    sessionId
  } = req.body;

  try {

    const paystackResponse =
    await axios.get(

      `https://api.paystack.co/transaction/verify/${reference}`,

      {
        headers: {
          Authorization:
          `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const paymentData =
    paystackResponse.data.data;

    if (paymentData.status !== "success") {

      return res.status(400).json({
        error: "Payment not successful"
      });
    }

    const session =
    await Session.findOne({ sessionId });

    if (!session) {

      return res.status(404).json({
        error: "Session not found"
      });
    }

    const totalAmount =
    session.currentOrder.reduce(
      (sum, item) =>
      sum + item.price,
      0
    );

    session.orderHistory.push({

      items: session.currentOrder,

      totalAmount,

      status: "paid"
    });

    session.currentOrder = [];

    await session.save();

    res.json({
      message:
      "Payment verified and order saved"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Verification failed"
    });
  }
};
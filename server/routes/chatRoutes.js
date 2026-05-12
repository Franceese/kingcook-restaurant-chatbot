const express = require("express");

const router = express.Router();

const {
  chatBot,
  initializePayment,
  verifyPayment,
  verifyAndSavePayment
} = require("../controllers/chatController");

router.post("/", chatBot);

router.post("/pay", initializePayment);

router.post(
  "/verify-payment",
  verifyAndSavePayment
);

router.get("/verify/:reference", verifyPayment);

module.exports = router;

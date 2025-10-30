const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

let razorpayInstance;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret) {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} else {
  console.warn("Razorpay keys are not configured. Payments will be disabled.");
  // Provide a safe stub so app boot doesn't crash on require
  razorpayInstance = {
    orders: {
      create: () => {
        throw new Error(
          "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
        );
      },
    },
  };
}

module.exports = razorpayInstance;

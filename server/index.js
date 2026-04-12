require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// A simple utility to calculate the cart total securely on the server
const calculateTotal = (items, discountCode) => {
    // Map of valid products/prices (mock DB)
    const dbPrices = {
        1: 289990, // Camera
        2: 10990   // Case
    };

    let subtotal = 0;
    if (items && Array.isArray(items)) {
        items.forEach(item => {
            if (dbPrices[item.id]) {
                const qty = item.qty && typeof item.qty === 'number' ? item.qty : 1;
                subtotal += dbPrices[item.id] * qty;
            }
        });
    }

    let discountAmount = 0;
    if ((discountCode || "").toLowerCase() === 'aurex') {
        discountAmount = Math.floor(subtotal * 0.1); // 10% discount
    }

    return subtotal - discountAmount;
};

app.post('/create-order', async (req, res) => {
  try {
    const { items, discountCode } = req.body;
    const totalAmount = calculateTotal(items, discountCode);

    if (totalAmount <= 0) {
        return res.status(400).json({ error: "Invalid cart total" });
    }

    const options = {
      amount: totalAmount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
        return res.status(500).send("Some error occured");
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

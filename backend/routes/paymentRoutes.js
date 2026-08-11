const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");

router.post("/add", async (req, res) => {
    try {
        const {
            date,
            time,
            reason,
            gstAvailable,
            paidBy,
            transactionId
        } = req.body;

        const payment = new Payment({
            date,
            time,
            reason,
            gstAvailable,
            paidBy,
            transactionId
        });

        await payment.save();

        res.status(201).json({
            message: "Payment saved successfully!",
            payment: payment
        });

    } catch (error) {
        console.error("Payment save error:", error);

        res.status(500).json({
            message: "Failed to save payment"
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });

        res.json(payments);

    } catch (error) {
        console.error("Error fetching payments:", error);

        res.status(500).json({
            message: "Failed to fetch payments"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);

        if (!deletedPayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json({
            message: "Payment deleted successfully"
        });

    } catch (error) {
        console.error("Delete payment error:", error);

        res.status(500).json({
            message: "Failed to delete payment"
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const {
            date,
            time,
            reason,
            gstAvailable,
            paidBy,
            transactionId
        } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            {
                date,
                time,
                reason,
                gstAvailable,
                paidBy,
                transactionId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json({
            message: "Payment updated successfully",
            payment: updatedPayment
        });

    } catch (error) {
        console.error("Update payment error:", error);

        res.status(500).json({
            message: "Failed to update payment"
        });
    }
});

module.exports = router;
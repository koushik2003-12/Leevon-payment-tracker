const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        gstAvailable: {
            type: Boolean,
            required: true
        },

        paidBy: {
            type: String,
            enum: ["parthu", "sai", "Vineeth"],
            required: true
        },

        transactionId: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
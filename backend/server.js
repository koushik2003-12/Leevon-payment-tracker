const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log("MongoDB connected successfully!");
};

// Make sure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection failed!");
        console.error(error.message);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// Routes
app.use("/api", authRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Payment Tracker Backend is running!");
});

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
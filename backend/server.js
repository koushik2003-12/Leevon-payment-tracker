const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Login routes
app.use("/api", authRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Payment Tracker Backend is running!");
});

// Start local server only when this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected successfully!");

            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.log("MongoDB connection failed!");
            console.log(error.message);
        });
}

module.exports = app;
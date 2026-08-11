const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const hashedPassword = await bcrypt.hash("1234", 10);

        const user = new User({
            username: "parthu",
            password: hashedPassword
        });

        await user.save();

        console.log("User created successfully!");
        console.log("Username: parthu");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error creating user:");
        console.error(error.message);
    }
};

createUser();
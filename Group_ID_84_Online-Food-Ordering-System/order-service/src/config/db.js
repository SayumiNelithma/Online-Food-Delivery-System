const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Order Service: MongoDB connected");
	} catch (error) {
		console.error("Order Service: Database connection failed:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;

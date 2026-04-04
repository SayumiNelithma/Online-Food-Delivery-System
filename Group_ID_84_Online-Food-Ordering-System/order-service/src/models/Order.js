const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
	{
		orderId: { type: String, required: true, unique: true, default: () => uuidv4() },
		userId: { type: String, required: true },
		items: { type: Array, default: [] },
		totalAmount: { type: Number, required: true, min: 0 },
		status: { type: String, enum: ["CREATED", "PAID", "CANCELLED"], default: "CREATED" }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

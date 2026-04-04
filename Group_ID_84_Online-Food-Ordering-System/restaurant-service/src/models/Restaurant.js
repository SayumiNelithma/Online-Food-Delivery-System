const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    contact_number: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);

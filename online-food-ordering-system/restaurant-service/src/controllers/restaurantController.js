const axios = require("axios");
const Restaurant = require("../models/Restaurant");

const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL ||
  process.env.GATEWAY_URL ||
  "http://localhost:8000";

// POST /restaurants
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({
      message: "Error creating restaurant",
      error: error.message
    });
  }
};

// GET /restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching restaurants",
      error: error.message
    });
  }
};

// GET /restaurants/:id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching restaurant",
      error: error.message
    });
  }
};

// PUT /restaurants/:id
const updateRestaurant = async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({
      message: "Error updating restaurant",
      error: error.message
    });
  }
};

// DELETE /restaurants/:id
const deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    try {
      await axios.delete(`${API_GATEWAY_URL}/api/menus/restaurant/${req.params.id}`);
    } catch (err) {
      console.error("Failed to delete associated menu items:", err.message);
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting restaurant",
      error: error.message
    });
  }
};
// GET /restaurants/:id/menus
const getMenusByRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuResponse = await axios.get(
      `${API_GATEWAY_URL}/api/menus/restaurant/${req.params.id}`
    );

    res.status(200).json(menuResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching restaurant menus",
      error: error.message
    });
  }
};

// PUT /restaurants/:id/status
const updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.status = status;
    await restaurant.save();

    res.status(200).json({
      message: "Restaurant status updated",
      restaurant
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating restaurant status",
      error: error.message
    });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getMenusByRestaurant,
  updateRestaurantStatus
};
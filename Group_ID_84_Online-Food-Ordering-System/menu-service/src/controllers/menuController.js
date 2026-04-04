const axios = require("axios");
const Menu = require("../models/Menu");

// POST /menus
const createMenuItem = async (req, res) => {
    try {
        const {
            restaurant_id,
            item_name,
            description,
            price,
            availability
        } = req.body;

        if (!restaurant_id || !item_name || price === undefined) {
            return res.status(400).json({
                message: "restaurant_id, item_name, and price are required"
            });
        }

        const restaurantUrl = process.env.API_GATEWAY_URL
            ? `${process.env.API_GATEWAY_URL}/api/restaurants/${restaurant_id}`
            : `http://localhost:8000/api/restaurants/${restaurant_id}`;

        const restaurantResponse = await axios.get(restaurantUrl);
        const restaurant = restaurantResponse.data;

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const menuItem = await Menu.create({
            restaurant_id,
            restaurant_name: restaurant.restaurant_name || restaurant.name,
            item_name,
            description,
            price,
            availability
        });

        res.status(201).json(menuItem);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(500).json({
            message: "Failed to create menu item",
            error: error.message
        });
    }
};

// GET /menus
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /menus/:id
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /menus/:id
const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /menus/:id
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /menus/restaurant/:restaurantId
const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const menuItems = await Menu.find({ restaurant_id: req.params.restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /menus/:id/availability
const updateMenuAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        if (availability === undefined) {
            return res.status(400).json({ message: "availability boolean is required" });
        }

        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        menuItem.availability = availability;
        await menuItem.save();

        res.status(200).json({ message: "Menu item availability updated", menuItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /menus/restaurant/:restaurantId
const deleteMenuItemsByRestaurant = async (req, res) => {
    try {
        const result = await Menu.deleteMany({ restaurant_id: req.params.restaurantId });
        res.status(200).json({ message: `Deleted ${result.deletedCount} menu items for restaurant` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    deleteMenuItemsByRestaurant,
    getMenuItemsByRestaurant,
    updateMenuAvailability
};
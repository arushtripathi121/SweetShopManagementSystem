import Sweet from "../models/Sweet.js";



// addSweet controller
export const addSweet = async (req, res) => {
    const { name, category, price, quantity } = req.body;

    try {
        if (!name || !category || price == null || quantity == null) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, category, price, quantity) are required"
            });
        }

        const sweet = await Sweet.create({ name, category, price, quantity });

        return res.status(201).json({
            success: true,
            sweet
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// getAllSweets controller
export const getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find();

        return res.status(200).json({
            success: true,
            sweets
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// searchSweets controller
export const searchSweets = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        const filter = {};

        if (name) filter.name = { $regex: name, $options: "i" };
        if (category) filter.category = { $regex: category, $options: "i" };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(filter);

        return res.status(200).json({
            success: true,
            sweets
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// updateSweet controller
export const updateSweet = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedSweet = await Sweet.findByIdAndUpdate(id, req.body, {
            new: true
        });

        if (!updatedSweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        return res.status(200).json({
            success: true,
            sweet: updatedSweet
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// deleteSweet controller
export const deleteSweet = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSweet = await Sweet.findByIdAndDelete(id);

        if (!deletedSweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sweet deleted successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

import Sweet from "../models/Sweet.js";

export const purchaseSweet = async (req, res) => {
    try {
        const sweetId = req.params.id;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        const sweet = await Sweet.findById(sweetId);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        sweet.quantity -= quantity;
        await sweet.save();

        return res.status(200).json({
            success: true,
            message: "Purchase successful",
            sweet
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error purchasing sweet"
        });
    }
};


export const restockSweet = async (req, res) => {
    try {
        const sweetId = req.params.id;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        const sweet = await Sweet.findById(sweetId);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        sweet.quantity += quantity;
        await sweet.save();

        return res.status(200).json({
            success: true,
            message: "Restock successful",
            sweet
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error restocking sweet"
        });
    }
};

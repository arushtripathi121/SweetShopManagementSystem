import Sweet from "../models/Sweet.js";

const validateQuantity = (quantity, res) => {
    if (!quantity || quantity <= 0) {
        res.status(400).json({
            success: false,
            message: "Quantity must be greater than zero"
        });
        return false;
    }
    return true;
};

const findSweet = async (id, res) => {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
        res.status(404).json({
            success: false,
            message: "Sweet not found"
        });
        return null;
    }
    return sweet;
};

export const purchaseSweet = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!validateQuantity(quantity, res)) return;

        const sweet = await findSweet(req.params.id, res);
        if (!sweet) return;

        if (sweet.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        sweet.quantity -= quantity;
        await sweet.save();

        res.status(200).json({
            success: true,
            message: "Purchase successful",
            sweet
        });

    } catch {
        res.status(500).json({
            success: false,
            message: "Error purchasing sweet"
        });
    }
};

export const restockSweet = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!validateQuantity(quantity, res)) return;

        const sweet = await findSweet(req.params.id, res);
        if (!sweet) return;

        sweet.quantity += quantity;
        await sweet.save();

        res.status(200).json({
            success: true,
            message: "Restock successful",
            sweet
        });

    } catch {
        res.status(500).json({
            success: false,
            message: "Error restocking sweet"
        });
    }
};

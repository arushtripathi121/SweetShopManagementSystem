export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Admin access only"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

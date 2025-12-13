// admin middleware
export const isAdmin = (req, res, next) => {
    // check if user role exists and is admin
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Admin access only"
    });
};

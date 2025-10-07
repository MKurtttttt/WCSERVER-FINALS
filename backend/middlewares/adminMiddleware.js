// middlewares/adminMiddleware.js
export const admin = (req, res, next) => {
  // req.user is set by your existing auth middleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

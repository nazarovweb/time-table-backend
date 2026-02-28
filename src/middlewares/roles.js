exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Login qiling" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Ruxsat yo‘q" });
    }

    next();
  };
};
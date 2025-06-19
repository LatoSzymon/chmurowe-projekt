const requireRole = (role) => (req, res, next) => {
  const roles = req.user?.realm_access?.roles || [];
  if (!roles.includes(role)) {
    return res.status(403).json({ message: "Brak wymaganej roli: " + role });
  }
  next();
};

module.exports = requireRole;

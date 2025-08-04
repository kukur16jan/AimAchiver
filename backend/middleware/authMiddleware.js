// Authentication middleware to ensure user is logged in (for Express routes)
module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

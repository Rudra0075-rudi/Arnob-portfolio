const ADMIN_SECRET = process.env.ADMIN_SECRET || 'arnob321';

function requireAdmin(req, res, next) {
  const headerSecret = req.header('x-admin-secret');
  const querySecret = req.query.adminSecret;
  if (headerSecret === ADMIN_SECRET || querySecret === ADMIN_SECRET) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { requireAdmin, ADMIN_SECRET };



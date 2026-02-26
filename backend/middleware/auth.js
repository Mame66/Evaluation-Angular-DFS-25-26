const jwt = require('jsonwebtoken');
const SECRET = 'dfs_secret_2526';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.admin) return res.status(403).json({ message: 'Accès interdit' });
  next();
};

module.exports = { authenticate, requireAdmin, SECRET };

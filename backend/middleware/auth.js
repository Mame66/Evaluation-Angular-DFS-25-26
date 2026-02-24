const utilisateurs = require('../data/utilisateurs');

function authMiddleware(req, res, next) {
    const email = req.headers['email'];

    if (!email) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    const user = utilisateurs.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: "Utilisateur inconnu" });
    }

    req.user = user;
    next();
}

function adminMiddleware(req, res, next) {
    if (!req.user.admin) {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }

    next();
}

module.exports = { authMiddleware, adminMiddleware };
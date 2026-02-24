const express = require('express');
const router = express.Router();
const utilisateurs = require('../data/utilisateurs');

router.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = utilisateurs.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.json({
        email: user.email,
        admin: user.admin
    });
});

module.exports = router;
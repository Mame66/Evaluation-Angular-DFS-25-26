const express = require('express');
const router = express.Router();
const utilisateurs = require('../data/utilisateurs');

// GET tous utilisateurs
router.get('/', (req, res) => res.json(utilisateurs));

// POST login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = utilisateurs.find(u => u.email === email && u.password === password);
    if(user) {
        res.json({ email: user.email, admin: user.admin });
    } else {
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const produits = require('../data/produits');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
    res.json(produits);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const produits = require('../data/produits');

router.get('/', (req, res) => res.json(produits));

module.exports = router;
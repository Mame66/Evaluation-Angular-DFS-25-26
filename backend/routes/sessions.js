const express = require('express');
const router = express.Router();
const sessions = require('../data/sessions');
const produits = require('../data/produits');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

//  GET toutes les sessions connecté
router.get('/', authMiddleware, (req, res) => {
    res.json(sessions);
});

//  session admin
router.post('/', authMiddleware, adminMiddleware, (req, res) => {

    const { nom } = req.body;

    if (!nom || nom.trim() === '') {
        return res.status(400).json({ message: "Nom de session obligatoire" });
    }

    const produitsSelectionnes = [];
    const indices = new Set();

    while (indices.size < 4) {
        const rand = Math.floor(Math.random() * produits.length);
        indices.add(produits[rand].id);
    }

    indices.forEach(i => produitsSelectionnes.push(i));

    const nouvelleSession = {
        nom,
        createur: req.user.email,
        produits: produitsSelectionnes,
        participants: []
    };

    sessions.push(nouvelleSession);

    res.status(201).json(nouvelleSession);
});

// Envoyer réponse
router.post('/:id/reponse', authMiddleware, (req, res) => {

    const sessionId = Number(req.params.id);
    const { reponse } = req.body;

    if (isNaN(reponse)) {
        return res.status(400).json({ message: "Prix invalide" });
    }

    const session = sessions[sessionId];

    if (!session) {
        return res.status(404).json({ message: "Session non trouvée" });
    }

    let participant = session.participants.find(
        p => p.utilisateur === req.user.email
    );

    if (!participant) {
        participant = {
            utilisateur: req.user.email,
            reponses: []
        };
        session.participants.push(participant);
    }

    participant.reponses.push(reponse);

    const indexProduit = participant.reponses.length - 1;
    const produitId = session.produits[indexProduit];
    const produit = produits.find(p => p.id === produitId);

    const difference = Math.abs(produit.prix - reponse);
    const points = Math.max(0, 100 - difference);

    res.json({
        prixReel: produit.prix,
        points: Math.round(points)
    });
});

module.exports = router;
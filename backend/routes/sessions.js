const express = require('express');
const router = express.Router();
const sessions = require('../data/sessions');
const produits = require('../data/produits');

// GET toutes les sessions
router.get('/', (req, res) => res.json(sessions));

// POST nouvelle session
router.post('/', (req, res) => {
    const { nom, createur } = req.body;
    if(!nom || !createur) return res.status(400).json({ message: 'Nom et créateur requis' });

    const produitsSelectionnes = [];
    const indices = new Set();
    while(indices.size < 4) {
        const rand = Math.floor(Math.random() * produits.length);
        indices.add(produits[rand].id);
    }
    indices.forEach(i => produitsSelectionnes.push(i));

    const nouvelleSession = { nom, createur, produits: produitsSelectionnes, participants: [] };
    sessions.push(nouvelleSession);
    res.status(201).json(nouvelleSession);
});

// POST réponse utilisateur
router.post('/:sessionId/reponse', (req, res) => {
    const { sessionId } = req.params;
    const { email, reponse } = req.body;
    const session = sessions.find((s, i) => i === sessionId);
    if(!session) return res.status(404).json({ message: 'Session non trouvée' });

    let participant = session.participants.find(p => p.utilisateur === email);
    if(!participant) {
        participant = { utilisateur: email, reponses: [] };
        session.participants.push(participant);
    }

    participant.reponses.push(reponse);

    // Calculer points
    const indexProduit = participant.reponses.length - 1;
    const idProduit = session.produits[indexProduit];
    const produit = produits.find(p => p.id === idProduit);
    const points = Math.max(0, 100 - Math.abs(produit.prix - reponse));

    res.json({ prixReel: produit.prix, points });
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { produits, utilisateurs, sessions, getNextSessionId } = require('./data');
const { authenticate, requireAdmin, SECRET } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// ===================== AUTH =====================

// POST /auth/login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }
  if (!password || typeof password !== 'string' || password.length < 3) {
    return res.status(400).json({ message: 'Mot de passe invalide' });
  }

  const user = utilisateurs.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

  const token = jwt.sign({ email: user.email, admin: user.admin }, SECRET, { expiresIn: '24h' });
  res.json({ token, user: { email: user.email, admin: user.admin } });
});

// ===================== PRODUITS =====================

// GET /produits
app.get('/produits', authenticate, (req, res) => {
  res.json(produits);
});

// ===================== SESSIONS =====================

// GET /sessions
app.get('/sessions', authenticate, (req, res) => {
  const result = sessions.map(s => ({
    id: s.id,
    nom: s.nom,
    createur: s.createur,
    produitCount: s.produits.length,
    participantCount: s.participants.length
  }));
  res.json(result);
});

// POST /sessions (admin only)
app.post('/sessions', authenticate, requireAdmin, (req, res) => {
  const { nom } = req.body;
  if (!nom || typeof nom !== 'string' || nom.trim().length < 3) {
    return res.status(400).json({ message: 'Le nom de la session doit faire au moins 3 caractères' });
  }

  // Sélectionner 4 produits au hasard
  const shuffled = [...produits].sort(() => Math.random() - 0.5);
  const selectedIds = shuffled.slice(0, 4).map(p => p.id);

  const newSession = {
    id: getNextSessionId(),
    nom: nom.trim(),
    createur: req.user.email,
    produits: selectedIds,
    participants: []
  };
  sessions.push(newSession);
  res.status(201).json(newSession);
});

// GET /sessions/:id
app.get('/sessions/:id', authenticate, (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) return res.status(404).json({ message: 'Session non trouvée' });

  const participant = session.participants.find(p => p.utilisateur === req.user.email);
  const reponses = participant ? participant.reponses : [];

  // Construire les infos produits pour les questions déjà répondues
  const produitsSession = session.produits.map((pid, index) => {
    const produit = produits.find(p => p.id === pid);
    const reponseDonnee = index < reponses.length;
    return {
      id: produit.id,
      nom: produit.nom,
      url: produit.url,
      prix: reponseDonnee ? produit.prix : undefined, // prix révélé seulement si répondu
      indexQuestion: index
    };
  });

  res.json({
    id: session.id,
    nom: session.nom,
    createur: session.createur,
    produits: produitsSession,
    reponses,
    prochainIndex: reponses.length
  });
});

// POST /sessions/:id/rejoindre
app.post('/sessions/:id/rejoindre', authenticate, (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) return res.status(404).json({ message: 'Session non trouvée' });

  const dejaDans = session.participants.find(p => p.utilisateur === req.user.email);
  if (!dejaDans) {
    session.participants.push({ utilisateur: req.user.email, reponses: [] });
  }

  res.json({ message: 'Rejoint avec succès' });
});

// POST /sessions/:id/repondre
app.post('/sessions/:id/repondre', authenticate, (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) return res.status(404).json({ message: 'Session non trouvée' });

  const { prix } = req.body;
  const prixNum = parseFloat(prix);
  if (prix === undefined || prix === null || isNaN(prixNum) || prixNum < 0) {
    return res.status(400).json({ message: 'Le prix doit être un nombre positif' });
  }

  let participant = session.participants.find(p => p.utilisateur === req.user.email);
  if (!participant) {
    participant = { utilisateur: req.user.email, reponses: [] };
    session.participants.push(participant);
  }

  const currentIndex = participant.reponses.length;
  if (currentIndex >= session.produits.length) {
    return res.status(400).json({ message: 'Toutes les questions ont déjà été répondues' });
  }

  participant.reponses.push(prixNum);

  // Calculer les points
  const produitId = session.produits[currentIndex];
  const produit = produits.find(p => p.id === produitId);
  const difference = Math.abs(produit.prix - prixNum);
  const points = Math.max(0, 100 - Math.round(difference));

  res.json({
    prixReel: produit.prix,
    points,
    indexQuestion: currentIndex,
    totalQuestions: session.produits.length,
    termine: participant.reponses.length === session.produits.length
  });
});

// GET /sessions/:id/classement
app.get('/sessions/:id/classement', authenticate, (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) return res.status(404).json({ message: 'Session non trouvée' });

  // Vérifier que l'utilisateur a répondu à toutes les questions
  const participant = session.participants.find(p => p.utilisateur === req.user.email);
  if (!participant || participant.reponses.length < session.produits.length) {
    return res.status(403).json({ message: 'Vous devez répondre à toutes les questions pour voir le classement' });
  }

  const classement = session.participants
    .filter(p => p.reponses.length === session.produits.length)
    .map(p => {
      const totalPoints = p.reponses.reduce((sum, rep, i) => {
        const produitId = session.produits[i];
        const produit = produits.find(pr => pr.id === produitId);
        const diff = Math.abs(produit.prix - rep);
        return sum + Math.max(0, 100 - Math.round(diff));
      }, 0);
      return { utilisateur: p.utilisateur, points: totalPoints };
    })
    .sort((a, b) => b.points - a.points);

  res.json(classement);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

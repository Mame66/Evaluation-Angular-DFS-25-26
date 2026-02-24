const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

//  route test
app.get('/', (req, res) => {
    res.send('Backend Test Oki ');
});

// Importer les routes plus tard (produits, sessions, utilisateurs)
app.use('/produits', require('./routes/produits'));
app.use('/sessions', require('./routes/sessions'));
app.use('/utilisateurs', require('./routes/utilisateurs'));

app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
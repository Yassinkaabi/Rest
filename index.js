const express = require('express');
const db = require('./database');
const multer = require('multer');

const app = express();
app.use(express.json());

const PORT = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage })

app.get('/', (req, res) => {
    res.json("Registre de personnes! Choisissez le bon routage!")
})

// Récupérer toutes les personnes
app.get('/personnes', (req, res) => {
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});
// Récupérer une personne par ID
app.get('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});
// Créer une nouvelle personne
app.post('/personnes', upload.single('image'), (req, res) => {
    const { nom, adresse } = req.body;
    const image = req.file.buffer;
    db.run(`INSERT INTO personnes (nom, adresse, image) VALUES (?,?,?)`, [nom, adresse, image], function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": {
                id: this.lastID
            }
        });
    });
});
// Mettre à jour une personne
app.put('/personnes/:id', (req, res) => {
    const id = req.params.id;
    const { nom, adresse } = req.body;
    db.run(`UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`, [nom, adresse, id], function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});
// Supprimer une personne
app.delete('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM personnes WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
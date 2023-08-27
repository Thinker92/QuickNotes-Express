const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Access 'public' directory files
app.use(express.static('public'));

// Route to serve index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Route to serve notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Read from db.json
const readDb = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
};

// Write to db.json
const writeDb = (notes) => {
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
};

// CRUD routes
// Create
app.post('/api/notes',(req,res) => {
    const notes = readDb();
    const newNote = req.body;
    newNote.id = notes.length + 1;
    notes.push(newNote);
    writeDb(notes);
    res.json(newNote);
});

// Read
app.get('/api/notes', (req,res) => {
    const notes = readDb();
    res.json(notes);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
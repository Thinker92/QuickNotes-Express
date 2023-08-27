const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Access 'public' directory files
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

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

// Update
app.put('/api/notes/:id', (req,res) => {
    const notes = readDb();
    const id = parseInt(req.params.id, 10);
    const updatedNote = req.body;

    const updatedNotes = notes.map(note => {
        if (note.id === id) {
            return { id, ...updatedNote};
        }
        return note;
    });

    if (JSON.stringify(notes) !== JSON.stringify(updatedNotes)) {
        writeDb(updatedNotes);
        res.json({id, ...updatedNote});
    } else {
        res.status(404).json({message: "Note not found"});
    }
})

// Delete
app.delete('/api/notes/:id', (req,res) => {
    const notes = readDb(); 
    const id = parseInt(req.params.id);

    const remainingNotes = notes.filter(note => note.id !== id);

    // Check if note was deleted properly
    if (notes.length !== remainingNotes.length) {
        writeDb(remainingNotes);
        res.send(204).send();
    } else {
        res.status(404).json({ message: "Note not found" });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
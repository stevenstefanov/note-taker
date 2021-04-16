// Dependencies
const fs = require('fs');
const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

// Server setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware setup for static pages
app.use(express.static(path.join(__dirname, 'public')));

// Index page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// Notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//DB JSON file
app.get('/api/notes', (req, res) => res.json(db));

// Add notes to the database
app.post('/api/notes', (req, res) => {
    const createNote = req.body;
    createNote.id = uuidv4();
    db.push(createNote);
    console.log(`${createNote.title} was created with id ${createNote.id}`);
    fs.writeFile('./db/db.json', JSON.stringify(db), err => {
        if(err) throw err;
        console.log("Updated saved notes!");
    })
    res.json(createNote);
});

// Delete notes from the database
app.delete('/api/notes/:id', (req, res) => {
    for(index of db) {
        if(index.id == req.params.id) {
            const removeIndex = db.indexOf(index);
            db.splice(removeIndex, 1);
            fs.writeFile('./db/db.json', JSON.stringify(db), err => {
                if(err) throw err;
            })
            console.log("Note deleted!");
        }
    }
    res.json();
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}.`));
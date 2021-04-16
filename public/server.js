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
app.use(epxress.static(path.join(__dirname, 'public')));

// Index page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// Notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//DB JSON file
app.get('/api/notes', (req, res) => res.json(db));

// Add notes to the database
app.post('/api.notes', (req, res) => {
    const addNote = req.body;
    addNote.id = uuidv4();
    db.push(addNote);
    console.log(`${addNote.title} was created with id ${addNote.id}`);
    fs.writeFile('./db/db.json', JSON.stringify(db), err => {
        if(err) throw err;
        console.log("Updated saved notes!");
    })
    res.json(addNote);
});

// Delete notes from the database

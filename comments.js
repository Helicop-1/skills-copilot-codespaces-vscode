// Create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Read comments.json file
var comments = require('./comments.json');

// Get all comments
app.get('/comments', function(req, res) {
    res.send(comments);
});

// Get comment by id
app.get('/comments/:id', function(req, res) {
    var comment = comments.find(c => c.id == req.params.id);
    if (comment) {
        res.send(comment);
    } else {
        res.status(404).send('Comment not found');
    }
});

// Add new comment
app.post('/comments', function(req, res) {
    var comment = req.body;
    if (comment) {
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
            if (err) {
                res.status(500).send('Error occurred while writing to file');
            } else {
                res.send('Comment added successfully');
            }
        });
    } else {
        res.status(400).send('Invalid request');
    }
});

// Update comment by id
app.put('/comments/:id', function(req, res) {
    var comment = comments.find(c => c.id == req.params.id);
    if (comment) {
        var index = comments.indexOf(comment);
        comments[index] = req.body;
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
            if (err) {
                res.status(500).send('Error occurred while writing to file');
            } else {
                res.send('Comment updated successfully');
            }
        });
    } else {
        res.status(404).send('Comment not found');
    }
});

// Delete comment by id
app.delete('/comments/:id', function(req, res) {
    var comment = comments.find(c => c.id == req.params.id);
    if (comment) {
        comments = comments.filter(c => c.id != req.params.id);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
            if (err) {
                res.status(500).send('Error occurred while writing to file');
            } else {
                res.send('Comment deleted successfully');
            }
        });
    } else {
        res.status(404).send
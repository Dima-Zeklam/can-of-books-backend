'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
const BookSchema = require('./model');
const bookModel = require('./model');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/books', {useNewUrlParser: true, useUnifiedTopology: true});


server.get('/', listenerHandl);
server.get('/books', getbook);
function listenerHandl(req, res) {
    res.send('all good');
}


// seedDataCollection();

// localhost:3001/books?email=
function getbook(req,res) {
    console.log('inside getbook func')
    let emailaddress2 = req.query.email;
    bookModel.find({email:emailaddress2},function(err,bookData){
        if(err) {
            console.log('error in getting the data')
        } else {
            console.log(bookData);
            res.send(bookData);
        }
    })
}
server.listen(PORT, () => {
    console.log('listening to port ', PORT);
});
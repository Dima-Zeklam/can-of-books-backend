'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/books', {useNewUrlParser: true, useUnifiedTopology: true});


server.get('/', listenerHandl);
server.get('/books', getbook);
function listenerHandl(req, res) {
    res.send('all good');
}

const BookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    email: String
})

const bookModel = mongoose.model('books',BookSchema);

function seedDataCollection() {
    const Potter = new bookModel({
        title: 'Harry Potter and the Goblet of Fire',
        description: 'A generation grew up on Rowling all-conquering magical fantasies, but countless adults have also been enthralled by her immersive world. Book four, the first of the doorstoppers, marks the point where the series really takes off. The Triwizard Tournament provides pace and tension, and Rowling makes her boy wizard look death in the eye for the first time.',
        status: 'read',
        email: 'dema.ziklam@gmail.com'
    })
    const LittleLife = new bookModel({
        title: 'A Little Life',
        description: 'This operatically harrowing American gay melodrama became an unlikely bestseller, and one of the most divisive novels of the century so far. One man’s life is blighted by abuse and its aftermath, but also illuminated by love and friendship. Some readers wept all night, some condemned it as titillating and exploitative, but no one could deny its power.',
        status: 'read',
        email: 'dema.ziklam@gmail.com'
    })
    const TheCost = new bookModel({
        title: 'The Cost of Living',
        description: 'Chaos is supposed to be what we most fear but I have come to believe it might be what we most want ... ” The second part of Levy’s “living memoir”, in which she leaves her marriage, is a fascinating companion piece to her deep yet playful novels. Feminism, mythology and the daily grind come together for a book that combines emotion and intellect to dazzling effect.',
        status: 'read',
        email: 'dema.ziklam@gmail.com'
    })
    Potter.save();
    LittleLife.save();
    TheCost.save();
}
// seedDataCollection();

// localhost:3001/books?emailaddress=
function getbook(req,res) {
    console.log('inside getbook func')
    let emailaddress2 = req.query.emailaddress;
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
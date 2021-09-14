'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
const mongoose = require('mongoose');
// Middleware (to parse the request body)
server.use(express.json());
const bookModel = require('./Modules/Model');//Model
const BookSchema = require('./Modules/Schema')//Schema
const ITbooksSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    price: String,
    image: String,
    url: String,
    email:String
})
const ITbookModel = mongoose.model("ItBooks", ITbooksSchema);

mongoose.connect(`${process.env.mongo_link}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// const mongoLink = process.env.mongo_link;



//server
server.get('/', listenerHandl);
server.get('/search', getApi);
server.get('/books', getbook);
server.post('/addBook', addBookHandler);
server.post('/addITBook',addITBook);
server.get('/getITbooks',getITbooks);
server.delete('/deleteBook/:bookID', deleteBookHandler);
server.delete('/deleteITBook/:ID', deleteITBook);
server.put('/ubdateBook/:bookID', updatebookHandler);

class ITbooks {
    constructor(item) {
        this.title = item.title,
            this.subtitle = item.subtitle,
            this.price = item.price,
            this.image = item.image,
            this.url = item.url
    }
}

// https://api.itbook.store/1.0/search
async function getApi(req, res) {
    let Bookname = req.query.Bookname;
    let URL = `https://api.itbook.store/1.0/search/${Bookname}`;
    let BookData = await axios.get(URL);
    // console.log('BookData:', BookData.data);
   let booksData =  BookData.data.books.map(item=>{
       return new ITbooks(item);
    })
    // console.log('booksData::;;',booksData)
    res.send(booksData);
}


//----------------- seedDataCollection ---------------------------
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
    const Delusion = new bookModel({
        title: 'The God Delusion',
        description: 'From the Sandman comics to his fantasy epic American Gods to Twitter, Gaiman towers over the world of books. But this perfectly achieved children’s novella, in which a plucky young girl enters a parallel world where her “Other Mother” is a spooky copy of her real-life mum, with buttons for eyes, might be his finest hour: a properly scary modern myth which cuts right to the heart of childhood fears and desires.',
        status: 'read',
        email: 'ahmad@gmail.com'
    })
    const Coraline = new bookModel({
        title: 'Coraline',
        description: 'A key text in the days when the “New Atheism” was much talked about, The God Delusion is a hard-hitting attack on religion, full of Dawkins’s confidence that faith produces fanatics and all arguments for God are ridiculous. What the evolutionary biologist lacks in philosophical sophistication, he makes up for in passion, and the book sold in huge numbers.',
        status: 'read',
        email: 'ahmad@gmail.com'
    })
    Potter.save();
    LittleLife.save();
    TheCost.save();
    Delusion.save();
    Coraline.save();
}
// seedDataCollection();




//----------------- listenerHandl ---------------------------
function listenerHandl(req, res) {
    res.send('all good');
}

//----------------- getbookHandler ---------------------------
function getbook(req, res) {

    let emailaddress2 = req.query.email;
    bookModel.find({ email: emailaddress2 }, function (err, bookData) {
        if (err) {
            console.log('error in getting the data')
        } else {
            // console.log(bookData);
            res.send(bookData);
        }
    })
}

// --------------- addBookHandler ---------------------
async function addBookHandler(req, res) {
    let emailaddress2 = req.query.email;
    console.log(emailaddress2);
    let {
        title,
        description,
        status,
        email } = req.body;

    const AddNewBook = new bookModel({
        title: title,
        description: description,
        status: status,
        email: email
    })

    await AddNewBook.save();
    bookModel.find({ email: email }, function (err, bookData) {
        if (err) {
            console.log('error in getting the data')
        } else {
            // console.log(bookData);
            res.send(bookData);
        }
    })
}


// --------------- deleteBookHandler ---------------------
async function deleteBookHandler(req, res) {
    let email1 = req.query.email;
    let DataID = req.params.bookID;
    console.log(email1);
    bookModel.remove({ _id: DataID }, (error, bookData) => {
        if (error) {
            console.log('error in deleting the data ')
        } else {
            console.log(bookData);
            bookModel.find({ email: email1 }, function (err, data) {
                if (err) {
                    console.log('error in deleting the data ');
                }
                else {
                    // console.log('dima', data);
                    res.send(data);

                }

            })


        }
    })

}

// --------------- updateCatHandler ---------------------

function updatebookHandler(req, res) {
    let bookID = req.params.bookID;
    let { title, description, status, email } = req.body;
    console.log(req.body);
    bookModel.findByIdAndUpdate(bookID, { title, description, status, email }, (error, updatedData) => {
        if (error) {
            console.log('error in updating the data')
        } else {
            console.log(updatedData, "Data updated!");

            bookModel.find({ email: req.body.email }, function (err, data) {
                if (err) {
                    console.log('error in getting the data')
                } else {
                    // console.log(data);
                    res.send(data);
                }
            })
        }
    })
}
// --------------- addITBook ---------------------
async function addITBook(req, res) {

    let {
        title,
        subtitle,
        price,
        image,
        url,
        email } = req.body;

    const AddITBook = new ITbookModel({
        title: title,
        subtitle: subtitle,
        price: price,
        image: image,
        url: url,
        email:email
    })

    await AddITBook.save();
    ITbookModel.find({ email: email }, function (err, bookData) {
        if (err) {
            console.log('error in getting the data')
        } else {
            // console.log(bookData);
            res.send(bookData);
            // console.log('ITbookdata:::',bookData);
        }
    })
    
}

// server.get('/getITbooks',getITbooks);
async function getITbooks(req,res){
let email = req.query.email;

ITbookModel.find({ email: email }, function (err, bookData) {
    if (err) {
        console.log('error in getting the data')
    } else {
        console.log('get book It:',bookData);
        res.send(bookData);
    }
})
}
// server.delete('/deleteITBook/:ID', deleteITBook);
async function deleteITBook(req, res) {
    let DataID = req.params.ID;
    // console.log(email1);
    ITbookModel.remove({ _id: DataID }, (error, bookData) => {
        if (error) {
            console.log('error in deleting the data ')
        } else {
            console.log(bookData);
            ITbookModel.find({ }, function (err, data) {
                if (err) {
                    console.log('error in deleting the data ');
                }
                else {
                    console.log('dima', data);
                    res.send(data);

                }

            })


        }
    })

}
// localhost:3001/books?email=
server.listen(PORT, () => {
    console.log('listening to port ', PORT);
});
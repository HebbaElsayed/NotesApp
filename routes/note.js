const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const database = client.db('note_app_db'); 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

router.post('/addnote', upload, async (req, res) => {
    console.log(req.body);
    console.log(req.body.name);
    // await new Note(req.body).save();
    res.redirect("/note/show")
    const newNote = new Note({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        // image: req.file.filename,
        note: req.body.note,
    });
    try {
        database.collection("notes").insertOne(newNote).then(() => {
            console.log("done")
            req.session.message = {
                type: 'success',
                message: 'user added successfully!'
            }
        })

    } catch (error) {
console.log(error)
    }

    //     res.redirect("/note/show")
    //     }).catch((err)=>{
    //             console.log(err);
    //         })

    // })
});


/* newNote.save((err)=>{
     if(err){
         res.json({message: err.message, type: 'danger'});
     }else{
         req.session.message = {
             type: 'success',
             message: 'user added successfully!'
         },
         res.redirect("/")
     }
 })*/


router.get("/show", (req, res) => {
    res.render('index', { title: "Note App" });
});

router.get("/add", (req, res) => {
    res.render("add_notes", { title: "Add notes" });
});
module.exports = router;
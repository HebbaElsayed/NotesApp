require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = 3000 || process.env.PORT

//DB connection 
mongoose.connect('mongodb://127.0.0.1:27017/',{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open',() => console.log('connected to the database'));

/*
mongoose.connect("mongodb://0.0.0.0:27017/Ta")
  .then(() => {
    app.listen(port, () => {
      console.log(`server running......`);
    });
  }).catch((err) => {
    console.log(err)
  })*/
   

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
})
);

app.use((req, res, next) => {
    res.locals.message = req.session.message ;
    delete req.session.message;
    next();
});

//set template engine
app.set('view engine', 'ejs');

const routes = require("./routes/note");

//routs prefect
app.use("/note", routes);

app.get("/",(req,res) => {
    res.send('Hello Heba');
});

// app.get("/", (req, res) => {
//   res.redirect("/index");
// }) 

app.listen(PORT,() => {
    console.log(`server started at port : ${PORT}`);
})
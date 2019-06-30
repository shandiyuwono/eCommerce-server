const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const port = process.env.PORT;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());
app.use('/', routes)

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/e-commerce' 

if(process.env.NODE_ENV) {
  url += process.env.NODE_ENV
}

mongoose.connect(url, {useNewUrlParser: true}, (err) => {
  if(err) {
    console.log(err)
  }
  else {
    console.log('mongoose connected')
  }
})

app.use(function(err,req,res,next){
  // console.log(err.code, '============ HERE')

  if(err.code === 404) {
    res.status(404).json({ message: 'Resource not found' })
  } 
  else if(err.name === 'ValidationError') {
    // console.log('goes here ===========')
    res.status(400).json({ message: err.message })
  } 
  else {
    const message = err.message || 'no message'
    const status = err.code || 500
    res.status(status).json({ message: message })
    console.log(err)
  }
});

app.listen(port, () => console.log(`listening on port ${port}`))

module.exports = app

//install axios, bcrypt, cors, dotenv, express, jwt, mongoose
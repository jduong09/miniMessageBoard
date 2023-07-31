const express = require('express');
const fs = require('fs');
const pug = require('pug');

const app = express();
const port = 3000;

const messages = [
  {
    text: "Hi there",
    user: "Amanda",
    added: new Date()
  },
  {
    text: "Hello World",
    user: "Charles",
    added: new Date()
  }
]

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', headerOne: 'Mini Message Board', messages: messages });
});

app.get('/new', (req, res) => {
  res.render('form', { title: 'New Message', headerOne: 'New Message' });
});

app.post('/new', (req, res) => {
  console.log(req.body);
  messages.push({ 
    text: req.body.message,
    user: req.body.user,
    added: new Date()
  });

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example App listening on port ${port}!`);
});
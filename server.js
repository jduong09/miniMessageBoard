const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const message = [
  {
    text: "Hi there",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World",
    user: "Charles",
    added: new Date()
  }
]

app.get('/', (req, res) => {
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  fs.readFile('./index.html', (error, html) => {
    res.write(html);
    res.end();
  });
});

app.get('/new', (req, res) => {
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  fs.readFile('./new.html', (error, html) => {
    res.write(html);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Example App listening on port ${port}!`);
});
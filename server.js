const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const username = encodeURIComponent(process.env.username);
const password = encodeURIComponent(process.env.password);
const uri = `mongodb+srv://${username}:${password}@cluster0.09zsxgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname));

// Read All Messages
app.get('/', async (req, res) => {
  await client.connect();
  const db = await client.db('miniMessageBoard');

  const messagesCursor = await db.collection('messages').find();
  const messages = [];

  for await (const message of messagesCursor) {
    messages.push({
      uuid: message._id.toString(),
      text: message.text,
      user: message.user,
      added: message.added
    });
  }
  await client.close();
  await res.render('index', { title: 'Home', headerOne: 'Mini Message Board', messages: messages });
});

// GET form for new message 
app.get('/new', (req, res) => {
  res.render('form', { title: 'New Message', headerOne: 'New Message' });
});

// Create Message
app.post('/new', async (req, res) => {
  const userData = { 
    text: req.body.message,
    user: req.body.user,
    added: new Date()
  };

  await client.connect();
  await client.db('miniMessageBoard').collection('messages').insertOne(userData, (err, res) => {
    if (err) throw err;
    console.log("1 message inserted");
    client.close();
  });
  res.redirect('/');
});

// Read Message Data, with _id = new ObjectId(:messageId)
app.get('/messages/:messageId', async (req, res) => {
  await client.connect();
  const message = await client.db('miniMessageBoard').collection('messages').findOne({ _id: new ObjectId(req.params.messageId) });
  
  const messageData = {
    id: req.params.messageId,
    text: message.text,
    user: message.user,
  }

  res.render('edit', { title: 'Edit Message', headerOne: 'Message', message: messageData });
});

// Update One Message, with _id = new ObjectId(:messageId)
app.post('/messages/:messageId', async (req, res) => {
  const updatedMessage = {
    $set: {
      text: req.body.message,
      user: req.body.user
    },
  };

  await client.connect();
  await client.db('miniMessageBoard').collection('messages').updateOne({ _id: new ObjectId(req.params.messageId) }, updatedMessage);
  await client.close();

  res.redirect('/');
});

app.delete('/messages/:messageId', async (req, res) => {
  await client.connect();
  await client.db('miniMessageBoard').collection('messages').deleteOne({ _id: new ObjectId(req.params.messageId) });
  await client.close();

  res.json({ message: 'success' });
});

app.listen(port, () => {
  console.log(`Example App listening on port ${port}!`);
});
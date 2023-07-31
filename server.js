const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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
];

async function run() {
  await client.connect();

  const dbName = "miniMessageBoard";
  const collectionName = "messages";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  try {
    await collection.insertMany(messages);
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  } finally {
    await client.close();
  }
}

run().catch(console.log.dir);



app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', headerOne: 'Mini Message Board', messages: messages });
});

app.get('/new', (req, res) => {
  res.render('form', { title: 'New Message', headerOne: 'New Message' });
});

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
  })

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example App listening on port ${port}!`);
});
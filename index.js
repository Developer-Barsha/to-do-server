const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0uudq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    await client.connect();
    const taskCollection = client.db('todo-app').collection('task');

    try {
        // get api for all tasks
        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.send(tasks);
        });

        // get api for users by email
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        });

        // post api
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        // put api
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { complete: true }
            }
            const result = await taskCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })

        // delete api
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from to do server');
})


app.listen(port, () => {
    console.log('server is running on port', port);
})
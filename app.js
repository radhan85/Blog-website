const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/blogWebsite';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Connected to MongoDB');

    const db = client.db('blogWebsite');
    const postsCollection = db.collection('posts');

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    app.post('/addPost', (req, res) => {
        const { title, content } = req.body;
        const post = {
            title,
            content,
            date: new Date()
        };

        postsCollection.insertOne(post, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error adding post');
                return;
            }

            res.status(200).send('Post added successfully');
        });
    });

    app.get('/getPosts', (req, res) => {
        postsCollection.find({}).toArray((err, posts) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving posts');
                return;
            }

            res.json(posts);
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const Comment = require('./models/Comment');
const Recipe = require('./models/Recipe');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/users', async (req, res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/api/recipes', async (req, res)=>{
    const recipe = new Recipe(req.body);
    try {
        await recipe.save();
        res.status(201).send(recipe);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/api/comments', async (req, res)=>{
    const comment = new Comment(req.body);
    try {
        await comment.save();
        res.status(201).send(comment);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.get('/api/recipes', async (req, res)=>{
    try {
        const recipes = await Recipe.find().populate('createdBy', 'name surname email');
        res.status(200).send(recipes);
    } catch (e) {
        res.status(500).send(e);
    }
})

app.get('/api/users', async (req, res)=>{
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (e){
        res.status(500).send(e)
    }
})

app.get('/api/comments', async (req, res)=>{
    try{
        const comments = await Comment.find().populate('commentedBy', 'name surname').populate('recipeId')
        res.status(200).send(comments)
    } catch(e) {
        res.status(500).send(e)
    }
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });





require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const Comment = require('./models/Comment');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());



app.post('/api/auth/login', async (req, res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ message: 'Login successful', token, name: user.name, surname: user.surname, email: user.email });
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e.message });
    }
})

app.post('/api/auth/register', async (req, res)=>{
    const user = new User(req.body);
    try {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: e.message });
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

app.get('/api/recipes/:id', async (req, res)=>{
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name surname email');
        if (!recipe) {
            return res.status(404).send({ error: 'Recipe not found' });
        }
        res.status(200).send(recipe);
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(404).send({ error: 'Recipe not found' });
        }
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
        const filter = {};
        if (req.query.recipeId) {
            filter.recipeId = req.query.recipeId;
        }
        const comments = await Comment.find(filter).populate('commentedBy', 'name surname').populate('recipeId')
        res.status(200).send(comments)
    } catch(e) {
        if (e.name === 'CastError') {
            return res.status(400).send({ error: 'Invalid recipeId' });
        }
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





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
const authMiddleware = require('./middleware/auth');
const { registerSchema, loginSchema } = require('./validation/authValidation');
const { recipeSchema } = require('./validation/recipeValidation');
const { commentSchema } = require('./validation/commentValidation');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());


app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { error } = loginSchema.safeParse(req.body);
    if (error) {
        return res.status(400).send({ error: error.issues[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).send({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.send({ message: 'Login successful', token, name: user.name, surname: user.surname, email: user.email, _id: user._id });

}))

app.post('/api/auth/register', asyncHandler(async (req, res) => {
    const { error } = registerSchema.safeParse(req.body);
    if (error) {
        return res.status(400).send({ error: error.issues[0].message });
    }
    const user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.status(201).send(user);
}))

app.get('/api/users', authMiddleware, asyncHandler(async (req, res) => {
    const users = await User.find()
    res.status(200).send(users)
}))


app.get('/api/comments', authMiddleware, asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.recipeId) {
        filter.recipeId = req.query.recipeId;
    }
    const comments = await Comment.find(filter).populate('commentedBy', 'name surname').populate('recipeId')
    res.status(200).send(comments)
}))

app.post('/api/comments', authMiddleware, asyncHandler(async (req, res) => {
    const { error } = commentSchema.safeParse(req.body);
    if (error) {
        const messages = error.issues.map(issue => issue.message);
        return res.status(400).send({ errors: messages });
    }
    const comment = new Comment({ ...req.body, commentedBy: req.user.userId });
    await comment.save();
    res.status(201).send(comment);
}))

app.put('/api/comments/:id', authMiddleware, asyncHandler(async (req, res) => {
    const { error } = commentSchema.safeParse(req.body);
    if (error) {
        return res.status(400).send({ error: error.issues[0].message });
    }
    const updated = await Comment.findOneAndUpdate(
        { _id: req.params.id, commentedBy: req.user.userId },
        { comment: req.body.comment },
        { new: true }
    );
    if (!updated) {
        return res.status(404).send({ error: 'Comment not found' });
    }
    res.status(200).send(updated);
}))

app.delete('/api/comments/:id', authMiddleware, asyncHandler(async (req, res) => {
    const deleted = await Comment.findOneAndDelete({ _id: req.params.id, commentedBy: req.user.userId });
    if (!deleted) {
        return res.status(404).send({ error: 'Comment not found' });
    }
    res.status(200).send(deleted);
}))

app.get('/api/recipes', authMiddleware, asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.userId) {
        filter.createdBy = req.query.userId;
    }
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    const recipes = await Recipe.find(filter).sort({ createdAt: sortOrder }).populate('createdBy', 'name surname email');
    res.status(200).send(recipes);
}))

app.get('/api/recipes/:id', authMiddleware, asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name surname email');
    if (!recipe) {
        return res.status(404).send({ error: 'Recipe not found' });
    }
    res.status(200).send(recipe);
}))

app.post('/api/recipes', authMiddleware, asyncHandler(async (req, res) => {
    const { error } = recipeSchema.safeParse(req.body);
    if (error) {
        return res.status(400).send({ error: error.issues[0].message });
    }
    const recipe = new Recipe({ ...req.body, createdBy: req.user.userId });
    await recipe.save();
    res.status(201).send(recipe);
}))

app.delete('/api/recipes/:id', authMiddleware, asyncHandler(async (req, res) => {
    const deleted = await Recipe.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
    if (!deleted) {
        return res.status(404).send({ error: 'Recipe not found or not authorized to delete' });
    }
    res.status(200).send({ message: 'Recipe deleted successfully' });
}))

app.patch('/api/recipes/:id', authMiddleware, asyncHandler(async (req, res) => {
    const { error } = recipeSchema.safeParse(req.body);
    if (error) {
        const messages = error.issues.map(issue => issue.message);
        return res.status(400).send({ errors: messages });
    }
    const updated = await Recipe.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.userId },
        { title: req.body.title, category: req.body.category, ingredients: req.body.ingredients, instructions: req.body.instructions },
        { new: true }
    ).populate('createdBy', 'name surname email');
    if (!updated) {
        return res.status(404).send({ error: 'Recipe not found or not authorized to update' });
    }
    res.status(200).send(updated);
}))

app.use(errorHandler);

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





const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await User.deleteOne({ email: 'testuser@example.com' }).exec();
    await mongoose.connection.close();
});

describe('Auth routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test',
                surname: 'User',
                email: 'testuser@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe('testuser@example.com');
    });
    it ('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('testuser@example.com');
    });
    it('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });
        
        expect(res.statusCode).toBe(401);
    });
    it('should reject login with wrong email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrongemail',
                password: 'password123'
            });
        
        expect(res.statusCode).toBe(400);
    });
    it('should reject recipe creation without a token', async () => {
        const res = await request(app)
            .post('/api/recipes')
            .send({
                title: 'Test Recipe',
                category: 'Dinner',
                ingredients: ['Ingredient 1', 'Ingredient 2'],
                instructions: 'Instructions'
            });
        
        expect(res.statusCode).toBe(401);
    })
    it('should create a recipe with valid token', async () => {
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123'
        });
    
    const token = loginRes.body.token;

    const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Test Recipe',
            category: 'Dinner',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: 'Instructions for the test recipe created with a valid token'
        });

    expect(res.statusCode).toBe(201);
});
});


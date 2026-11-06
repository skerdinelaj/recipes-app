// Starts a throwaway in-memory MongoDB before the test run, so tests never
// touch Atlas and every run starts with an empty database.
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
    const mongod = await MongoMemoryServer.create();
    globalThis.__MONGOD__ = mongod;
    process.env.MONGODB_URI = mongod.getUri('recipes-test');
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-only-jwt-secret';
};

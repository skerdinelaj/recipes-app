// Connects to MongoDB Atlas and runs a small read so the free cluster
// doesn't get paused for inactivity. Run by .github/workflows/keepalive.yml.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

async function main() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    await mongoose.connection.db.admin().ping();
    const count = await Recipe.estimatedDocumentCount();
    console.log(`Keep-alive OK: connected to ${mongoose.connection.host}, ${count} recipes`);
}

main()
    .catch((err) => {
        console.error('Keep-alive failed:', err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());

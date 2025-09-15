const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newMongoURI = 'mongodb+srv://tamil:tamil@cluster0.lxk1iio.mongodb.net/skillswap?retryWrites=true&w=majority';

// Read existing .env file if it exists
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
    console.log('.env file not found, creating a new one');
}

// Update or add MONGO_URI
let envLines = envContent.split('\n');
let mongoUriFound = false;

envLines = envLines.map(line => {
    if (line.startsWith('MONGO_URI=')) {
        mongoUriFound = true;
        return `MONGO_URI=${newMongoURI}`;
    }
    return line;
});

if (!mongoUriFound) {
    envLines.push(`MONGO_URI=${newMongoURI}`);
}

// Write back to .env file
fs.writeFileSync(envPath, envLines.join('\n'));
console.log('✅ Updated .env file with new MongoDB connection string');

const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { Branch } = require('./models/branch.model');

// Load environment variables
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

// Connect to database
async function dbConnection() {
    try {
        const url = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/placement_cell';
        await mongoose.connect(url);
        console.log('Database connected...');
        return true;
    } catch (err) {
        console.log("Database connection failed", err);
        return false;
    }
}

// Create initial branches
async function createInitialBranches() {
    try {
        // Define branches to create
        const branches = [
            { branchCode: 'CSE', branchName: 'Computer Science Engineering' },
            { branchCode: 'ECE', branchName: 'Electronics and Communication Engineering' },
            { branchCode: 'IT', branchName: 'Information Technology' },
            { branchCode: 'ME', branchName: 'Mechanical Engineering' },
            { branchCode: 'CE', branchName: 'Civil Engineering' },
            { branchCode: 'EE', branchName: 'Electrical Engineering' },
            { branchCode: 'ADMIN', branchName: 'Administration' }
        ];
        
        // Count existing branches
        const count = await Branch.countDocuments();
        if (count > 0) {
            // console.log(`${count} branches already exist. Skipping creation.`);
            return;
        }
        
        // Insert branches
        await Branch.insertMany(branches);
        // console.log(`${branches.length} branches created successfully`);
        
    } catch (error) {
        console.error('Error creating branches:', error);
    }
}

// Run the initialization
async function initializeBranches() {
    const connected = await dbConnection();
    if (connected) {
        await createInitialBranches();
        mongoose.connection.close();
    }
}

initializeBranches(); 
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { User } = require('./models/user.models');

// Load environment variables
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

// Connect to database
async function dbConnection() {
    try {
        const url = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/placement_cell';
        await mongoose.connect(url);
        return true;
    } catch (err) {
        return false;
    }
}

// Create admin user
async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            return;
        }
        
        // Create a new admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            enrolmentNo: 'ADMIN001',
            gender: 'Other',
            batch: '2023',
            branch: 'Administration', // Make sure this branch exists in your database
            mobile: '1234567890',
            dob: new Date('1990-01-01'),
            password: 'admin123',
            userType: 'admin',
            isAdmin: true
        });
        
        await adminUser.save();
        
    } catch (error) {
    }
}

// Run the initialization
async function initializeAdmin() {
    const connected = await dbConnection();
    if (connected) {
        await createAdminUser();
        mongoose.connection.close();
    }
}

initializeAdmin(); 
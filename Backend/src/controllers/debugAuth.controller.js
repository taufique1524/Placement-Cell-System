const { User } = require('../models/user.models');
const { Branch } = require('../models/branch.model');
const { asyncHandler } = require('../utils/asyncHandler.js');

// Debug endpoint to create a test user without any restrictions
exports.createTestUser = asyncHandler(async (req, res) => {
    try {
        // Check if we have any branches
        const branchCount = await Branch.countDocuments();
        if (branchCount === 0) {
            // Create default branch if none exists
            const defaultBranch = new Branch({
                branchCode: 'CSE',
                branchName: 'Computer Science Engineering'
            });
            await defaultBranch.save();
            console.log('Created default CSE branch for test user');
        }

        // Get any branch
        const branch = await Branch.findOne();
        
        // Check if test user exists
        let testUser = await User.findOne({ email: 'test@example.com' });
        
        if (testUser) {
            return res.json({ 
                success: 1, 
                message: "Test user already exists",
                user: {
                    email: 'test@example.com',
                    password: 'test123'
                }
            });
        }
        
        // Create a test user
        testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'test123',
            enrolmentNo: 'TEST001',
            gender: 'Other',
            batch: '2023',
            branch: branch ? branch.branchCode : 'CSE',
            mobile: '1234567890',
            dob: new Date('2000-01-01'),
            userType: 'student',
            isAdmin: false
        });
        
        await testUser.save();
        
        // Check if we should redirect to the frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const wantsRedirect = req.query.redirect === 'true';
        
        if (wantsRedirect) {
            // Redirect to the frontend with credentials
            res.redirect(`${frontendUrl}/test-user-redirect?email=test@example.com&password=test123`);
        } else {
            // Just return JSON
            res.json({ 
                success: 1, 
                message: "Test user created successfully!", 
                user: {
                    email: 'test@example.com',
                    password: 'test123'
                }
            });
        }
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ 
            success: 0, 
            error: { message: "Error creating test user" } 
        });
    }
}); 
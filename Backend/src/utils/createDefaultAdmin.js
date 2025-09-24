const { User } = require('../models/user.models');
const { Branch } = require('../models/branch.model');
require('dotenv').config();
/**
 * Function to check if any admin user exists, and if not, create a default one
 */
async function createDefaultAdminIfNone() {
    try {
        // Check if any admin user exists
        const adminCount = await User.countDocuments({ isAdmin: true });
        
        if (adminCount === 0) {
            
            // Make sure the ADMIN branch exists
            let adminBranch = await Branch.findOne({ branchCode: 'ADMIN' });
            if (!adminBranch) {
                adminBranch = new Branch({
                    branchCode: 'ADMIN',
                    branchName: 'Administration'
                });
                await adminBranch.save();
            }
            
            // Create default admin user
            const defaultAdmin = new User({
                name: process.env.DEFAULT_ADMIN_NAME,
                email: process.env.DEFAULT_ADMIN_EMAIL,
                password: process.env.DEFAULT_ADMIN_PASSWORD,
                enrolmentNo: process.env.DEFAULT_ADMIN_ENROLMENT,
                gender: 'Other',
                batch: '2023',
                branch: 'ADMIN',
                mobile: process.env.DEFAULT_ADMIN_MOBILE,
                dob: new Date(process.env.DEFAULT_ADMIN_DOB),
                userType: 'admin',
                isAdmin: true
            });
            
            await defaultAdmin.save();
        } else {
            
        }
    } catch (error) {
        
    }
}

module.exports = { createDefaultAdminIfNone }; 
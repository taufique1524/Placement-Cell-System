const { Branch } = require('../models/branch.model');

/**
 * Function to check if any branches exist, and if not, create default ones
 */
async function createDefaultBranchesIfNone() {
    try {
        // Check if any branches exist
        const branchCount = await Branch.countDocuments();
        
        if (branchCount === 0) {
            console.log('No branches found. Creating default branches...');
            
            // Define default branches
            const defaultBranches = [
                { branchCode: 'CSE', branchName: 'Computer Science Engineering' },
                { branchCode: 'ECE', branchName: 'Electronics and Communication Engineering' },
                { branchCode: 'IT', branchName: 'Information Technology' },
                { branchCode: 'ME', branchName: 'Mechanical Engineering' },
                { branchCode: 'CE', branchName: 'Civil Engineering' },
                { branchCode: 'EE', branchName: 'Electrical Engineering' },
                { branchCode: 'ADMIN', branchName: 'Administration' }
            ];
            
            // Insert all branches
            await Branch.insertMany(defaultBranches);
       //     console.log(`${defaultBranches.length} default branches created successfully!`);
        } else {
          //  console.log(`${branchCount} branches already exist.`);
        }
    } catch (error) {
        console.error('Error checking/creating default branches:', error);
    }
}

module.exports = { createDefaultBranchesIfNone }; 
const JobInterest = require('../models/jobInterest.model.js');
const Opening = require('../models/openings.model.js');
const { User } = require('../models/user.models.js');
const { Selection } = require('../models/selections.model.js');
const { asyncHandler } = require('../utils/asyncHandler.js');

// Express interest in a job opening
const expressInterest = asyncHandler(async (req, res) => {
    const { openingId, isInterested, reason } = req.body;
    const userId = req.user._id;

    if (!openingId) {
        return res.status(400).json({
            success: 0,
            message: "Opening ID is required"
        });
    }

    try {
        // Check if the opening exists
        const opening = await Opening.findById(openingId);
        if (!opening) {
            return res.status(404).json({
                success: 0,
                message: "Job opening not found"
            });
        }

        // Get user details to check eligibility
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found"
            });
        }

        // Check if user is eligible for the job with detailed reason
        const eligibilityResult = await checkEligibilityWithReason(user, opening);

        // If student is already placed, prevent them from expressing interest
        if (eligibilityResult.isPlaced) {
            return res.status(400).json({
                success: 0,
                message: eligibilityResult.reason,
                isPlaced: true
            });
        }

        // Check if the user has already expressed interest
        let jobInterest = await JobInterest.findOne({ user: userId, opening: openingId });

        if (jobInterest) {
            // Update existing record
            jobInterest.isInterested = isInterested;
            if (reason) jobInterest.reason = reason;
            jobInterest.isEligible = eligibilityResult.isEligible;
            await jobInterest.save();
        } else {
            // Create new record
            jobInterest = new JobInterest({
                user: userId,
                opening: openingId,
                isInterested,
                reason: reason || "",
                isEligible: eligibilityResult.isEligible
            });
            await jobInterest.save();
        }

        return res.status(200).json({
            success: 1,
            isEligible: eligibilityResult.isEligible,
            eligibilityReason: eligibilityResult.reason,
            isPlaced: eligibilityResult.isPlaced || false,
            message: eligibilityResult.isEligible
                ? "Your interest has been recorded"
                : "Your interest has been recorded, but you may not meet all eligibility criteria"
        });
    } catch (error) {
        console.error("Error in expressInterest:", error);
        return res.status(500).json({
            success: 0,
            message: "An error occurred while recording your interest"
        });
    }
});

// Get interest status for a user and opening
const getInterestStatus = asyncHandler(async (req, res) => {
    const { openingId } = req.params;
    const userId = req.user._id;

    if (!openingId) {
        return res.status(400).json({
            success: 0,
            message: "Opening ID is required"
        });
    }

    try {
        // Check if the opening exists
        const opening = await Opening.findById(openingId);
        if (!opening) {
            return res.status(404).json({
                success: 0,
                message: "Job opening not found"
            });
        }

        // Get user details to check eligibility
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found"
            });
        }

        // Check eligibility and get detailed reason
        const eligibilityResult = await checkEligibilityWithReason(user, opening);

        // Find interest record
        const jobInterest = await JobInterest.findOne({ user: userId, opening: openingId });

        if (jobInterest) {
            return res.status(200).json({
                success: 1,
                data: {
                    isInterested: jobInterest.isInterested,
                    reason: jobInterest.reason,
                    isEligible: eligibilityResult.isEligible,
                    eligibilityReason: eligibilityResult.reason,
                    isPlaced: eligibilityResult.isPlaced || false
                }
            });
        } else {
            return res.status(200).json({
                success: 1,
                data: {
                    isInterested: null, // No preference expressed yet
                    reason: "",
                    isEligible: eligibilityResult.isEligible,
                    eligibilityReason: eligibilityResult.reason,
                    isPlaced: eligibilityResult.isPlaced || false
                }
            });
        }
    } catch (error) {
        console.error("Error in getInterestStatus:", error);
        return res.status(500).json({
            success: 0,
            message: "An error occurred while fetching interest status"
        });
    }
});

// Get statistics for a job opening
const getOpeningStatistics = asyncHandler(async (req, res) => {
    const { openingId } = req.params;

    if (!openingId) {
        return res.status(400).json({
            success: 0,
            message: "Opening ID is required"
        });
    }

    try {
        // Check if the opening exists
        const opening = await Opening.findById(openingId);
        if (!opening) {
            return res.status(404).json({
                success: 0,
                message: "Job opening not found"
            });
        }

        // Get interest statistics
        const totalInterested = await JobInterest.countDocuments({ 
            opening: openingId, 
            isInterested: true 
        });
        
        const totalNotInterested = await JobInterest.countDocuments({ 
            opening: openingId, 
            isInterested: false 
        });
        
        const eligibleAndInterested = await JobInterest.countDocuments({ 
            opening: openingId, 
            isInterested: true,
            isEligible: true
        });

        const interestedUsers = await JobInterest.find({
            opening: openingId,
            isInterested: true
        }).populate('user', 'name email branch batch enrolmentNo');

        return res.status(200).json({
            success: 1,
            statistics: {
                totalInterested,
                totalNotInterested,
                eligibleAndInterested,
                interestedUsers
            }
        });
    } catch (error) {
        console.error("Error in getOpeningStatistics:", error);
        return res.status(500).json({
            success: 0,
            message: "An error occurred while fetching statistics"
        });
    }
});

// Helper function to check if a student is already placed
async function checkIfStudentIsPlaced(userId) {
    try {
        const selection = await Selection.findOne({ studentId: userId }).populate('companyId', 'companyName');
        return selection;
    } catch (error) {
        console.error("Error checking placement status:", error);
        return null;
    }
}

// Helper function to check if a user is eligible for a job opening with detailed reason
async function checkEligibilityWithReason(user, opening) {
    // Skip eligibility check for admins
    if (user.isAdmin) {
        return { isEligible: true, reason: "Admin users are always eligible", isPlaced: false };
    }

    // Check if student is already placed
    const placementRecord = await checkIfStudentIsPlaced(user._id);
    if (placementRecord) {
        const companyName = placementRecord.companyId?.companyName || "a company";
        return {
            isEligible: false,
            reason: `You are already placed in ${companyName}. You cannot apply for new job openings.`,
            isPlaced: true
        };
    }

    // Check if user's batch matches opening's batch
    if (user.batch !== opening.batch) {
        return {
            isEligible: false,
            reason: `Your batch (${user.batch}) is not eligible for this job. Required batch: ${opening.batch}`,
            isPlaced: false
        };
    }

    // Check if user's branch is allowed
    const branchAllowed = opening.branchesAllowed.includes(user.branch);
    if (!branchAllowed) {
        return {
            isEligible: false,
            reason: `Your branch (${user.branch}) is not eligible for this job. Allowed branches: ${opening.branchesAllowed.join(', ')}`,
            isPlaced: false
        };
    }

    // Branch is allowed, now check CGPA criteria if it exists
    if (opening.cgpaCriteria && opening.cgpaCriteria.length > 0) {
        // Find the CGPA requirement for the user's branch
        const branchCriteria = opening.cgpaCriteria.find(
            criteria => criteria.branch === user.branch
        );

        // If there's a specific CGPA requirement for this branch
        if (branchCriteria) {
            // Compare user's CGPA with the required CGPA
            const userCgpa = parseFloat(user.cgpa) || 0;
            const requiredCgpa = parseFloat(branchCriteria.cgpa) || 0;
            
            if (userCgpa < requiredCgpa) {
                return {
                    isEligible: false,
                    reason: `Your CGPA (${userCgpa}) is less than the required CGPA (${requiredCgpa}) for your branch`,
                    isPlaced: false
                };
            }
        }
    }

    // All criteria are met
    return { isEligible: true, reason: "You meet all eligibility criteria", isPlaced: false };
}

// Simple eligibility check function that returns just a boolean
function checkEligibility(user, opening) {
    const result = checkEligibilityWithReason(user, opening);
    return result.isEligible;
}

module.exports = {
    expressInterest,
    getInterestStatus,
    getOpeningStatistics
};
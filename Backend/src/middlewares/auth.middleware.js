const jwt = require('jsonwebtoken')
const {User} = require('../models/user.models.js')
const { asyncHandler } = require('../utils/asyncHandler.js')
exports.authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        // Get token from header - check multiple possible header names
        let token = req.header("token") || req.header("Authorization") || req.header("authorization") || null;
        
        // If token is in Authorization header with Bearer prefix, extract the token
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        
        // If token is "null" string, convert to null
        if (token === "null") {
            token = null;
        }
        
        // If no token provided
        if (!token) {
            return res.status(401).json({
                success: 0,
                message: "Authentication required. Please login."
            });
        }
        
        // Verify token
        let decoded;
        try {
            // Use default secret if environment variable is not set
            const secret = process.env.ACCESS_TOKEN_SECRET || 'mysecretaccesstoken123';
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({
                success: 0,
                message: "Invalid or expired token. Please login again."
            });
        }
        
        if (!decoded || !decoded._id) {
            return res.status(401).json({
                success: 0,
                message: "Invalid token payload. Please login again."
            });
        }

        // Find user in database
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found. Account may have been deleted."
            });
        }

        // Add user to request object
        req.user = user;
        
        // Continue to next middleware/controller
        next();
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Authentication error. Please try again."
        });
    }
});
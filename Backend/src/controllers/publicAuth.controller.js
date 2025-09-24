const { User } = require('../models/user.models');
const { Branch } = require('../models/branch.model');
const { asyncHandler } = require('../utils/asyncHandler.js');
const sendOTPEmail = require('../utils/Mails/RegistrationEmails/sendOTPEmail');
const getOTPEmailHtml = require('../utils/Mails/RegistrationEmails/htmlOTPEmail');
const jwt = require('jsonwebtoken');

// In-memory store for pre-registration OTPs (for demo; use Redis/DB in production)
const preRegisterOTPs = {};

// Public registration controller that doesn't need admin access
exports.publicRegister = asyncHandler(async (req, res) => {
    let formData = req.body;
    // Require email verification token
    const { emailVerificationToken } = formData;
    if (!emailVerificationToken) {
        return res.status(400).json({ success: 0, message: 'Email verification required.' });
    }
    let decoded;
    try {
        decoded = require('jsonwebtoken').verify(emailVerificationToken, process.env.EMAIL_VERIFICATION_SECRET || 'emailverifysecret');
    } catch (err) {
        return res.status(400).json({ success: 0, message: 'Invalid or expired email verification token.' });
    }
    if (!decoded.verified || decoded.email !== formData.email) {
        return res.status(400).json({ success: 0, message: 'Email not verified or does not match.' });
    }
    // Simple validation
    if (!formData.email || !formData.password || !formData.name) {
        return res.status(400).json({ 
            success: 0, 
            error: { 
                message: "Missing required fields",
                emailError: !formData.email ? "Email is required" : "",
                passwordError: !formData.password ? "Password is required" : "",
                nameError: !formData.name ? "Name is required" : ""
            } 
        });
    }
    // Check if email already exists
    const existingUser = await User.findOne({ email: formData.email });
    if (existingUser) {
        return res.status(400).json({ 
            success: 0, 
            error: { emailError: "Email already in use" } 
        });
    }
    // Make sure we have a valid branch
    const defaultBranch = "CSE";
    let branchToUse = formData.branch || defaultBranch;
    // Verify branch exists
    const branchExists = await Branch.findOne({ branchCode: branchToUse });
    if (!branchExists) {
        // Fall back to a branch we know exists
        const anyBranch = await Branch.findOne({});
        if (anyBranch) {
            branchToUse = anyBranch.branchCode;
        }
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    // Create new user with minimal required fields
    const user = new User({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: formData.mobile || "0000000000",
        batch: formData.batch || "2023",
        branch: branchToUse,
        gender: formData.gender || "Other",
        enrolmentNo: formData.enrolmentNo || `USER${Date.now().toString().slice(-6)}`,
        dob: formData.dob || new Date(),
        userType: "student",
        isAdmin: false,
        isEmailVerified: true // Mark as verified!
    });
    await user.save();
    // Don't return sensitive information
    const { password, ...userData } = user.toObject();
    res.status(201).json({ 
        success: 1, 
        message: "Registration successful! You can now log in.", 
        user: userData 
    });
}); 

exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            success: 0,
            message: 'Email and OTP are required.'
        });
    }
    const user = await User.findOne({ email, emailVerificationOTP: otp });
    if (!user) {
        return res.status(400).json({
            success: 0,
            message: 'Invalid OTP or email.'
        });
    }
    if (!user.emailVerificationOTPExpires || user.emailVerificationOTPExpires < new Date()) {
        return res.status(400).json({
            success: 0,
            message: 'OTP has expired. Please request a new one.'
        });
    }
    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;
    await user.save();
    return res.status(200).json({
        success: 1,
        message: 'Email verified successfully! You can now log in.'
    });
}); 

exports.requestEmailOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: 0, message: 'Email is required.' });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    preRegisterOTPs[email] = { otp, otpExpiry };
    // Send OTP email
    const subject = 'Verify your email for Placements Drive';
    const html = getOTPEmailHtml(email, otp);
    await sendOTPEmail(email, subject, '', html);
    res.json({ success: 1, message: 'OTP sent to email.' });
});

exports.verifyEmailOTPPreRegister = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: 0, message: 'Email and OTP are required.' });
    }
    const record = preRegisterOTPs[email];
    if (!record || record.otp !== otp) {
        return res.status(400).json({ success: 0, message: 'Invalid OTP.' });
    }
    if (Date.now() > record.otpExpiry) {
        delete preRegisterOTPs[email];
        return res.status(400).json({ success: 0, message: 'OTP expired.' });
    }
    // Generate a short-lived token for this email
    const token = jwt.sign({ email, verified: true }, process.env.EMAIL_VERIFICATION_SECRET || 'emailverifysecret', { expiresIn: '15m' });
    delete preRegisterOTPs[email];
    res.json({ success: 1, message: 'Email verified.', token });
}); 

exports.resendOTPForExistingUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: 0, message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: 0, message: 'User not found.' });
    }
    if (user.isEmailVerified) {
        return res.status(400).json({ success: 0, message: 'Email is already verified.' });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = otpExpiry;
    await user.save();
    // Send OTP email
    const subject = 'Verify your email for Placements Drive';
    const html = getOTPEmailHtml(user.name || user.email, otp);
    await sendOTPEmail(email, subject, '', html);
    res.json({ success: 1, message: 'OTP sent to your email.' });
});

exports.verifyOTPForExistingUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: 0, message: 'Email and OTP are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: 0, message: 'User not found.' });
    }
    if (user.isEmailVerified) {
        return res.status(400).json({ success: 0, message: 'Email is already verified.' });
    }
    if (!user.emailVerificationOTP || user.emailVerificationOTP !== otp) {
        return res.status(400).json({ success: 0, message: 'Invalid OTP.' });
    }
    if (!user.emailVerificationOTPExpires || user.emailVerificationOTPExpires < new Date()) {
        return res.status(400).json({ success: 0, message: 'OTP has expired. Please request a new one.' });
    }
    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;
    await user.save();
    res.json({ success: 1, message: 'Email verified successfully! You can now log in.' });
}); 
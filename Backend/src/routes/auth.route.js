const express = require('express');

const {
    createUser,
    login,
    resetForgotPassword,
    resetFinalForgotPassword,
} = require('../controllers/auth.controller.js');
const { publicRegister, verifyEmailOTP, requestEmailOTP, verifyEmailOTPPreRegister, resendOTPForExistingUser, verifyOTPForExistingUser } = require('../controllers/publicAuth.controller.js');
const { createTestUser } = require('../controllers/debugAuth.controller.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');
const { isAdminMiddleware } = require('../middlewares/isAdmin.middleware.js');


const router = express.Router();

router
    .post('/signup',
        authMiddleware,
        isAdminMiddleware,
        createUser
    ) // /auth/signup - admin protected route
    .post('/register',
        publicRegister
    ) // /auth/register - public registration endpoint
    .post('/verify-otp',
        verifyEmailOTP
    ) // /auth/verify-otp - verify email OTP endpoint
    .post('/request-otp',
        requestEmailOTP
    ) // /auth/request-otp - request OTP for email verification (pre-registration)
    .post('/verify-otp-preregister',
        verifyEmailOTPPreRegister
    ) // /auth/verify-otp-preregister - verify OTP before registration
    .post('/resend-otp-existing-user',
        resendOTPForExistingUser
    ) // /auth/resend-otp-existing-user - resend OTP for existing user
    .post('/verify-otp-existing-user',
        verifyOTPForExistingUser
    ) // /auth/verify-otp-existing-user - verify OTP for existing user
    .get('/create-test-user',
        createTestUser
    ) // /auth/create-test-user - debug endpoint for creating a test user
    .post('/admin-signup',
        authMiddleware,
        isAdminMiddleware,
        createUser
    ) // /auth/admin-signup - admin protected signup
    .post('/login', login)
    .post('/reset/:id/:token', resetFinalForgotPassword)
    .post('/resetPassword', resetForgotPassword) // this is reset for forgot password case


exports.authRoute = router;
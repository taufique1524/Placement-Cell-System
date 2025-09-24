const express = require('express');
const router = express.Router();
const { expressInterest, getInterestStatus, getOpeningStatistics } = require('../controllers/jobInterest.controller.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');
const { isAdminMiddleware } = require('../middlewares/isAdmin.middleware.js');

// Express interest in a job opening
router.post('/express', authMiddleware, expressInterest);

// Get interest status for a user and opening
router.get('/status/:openingId', authMiddleware, getInterestStatus);

// Get statistics for a job opening (admin only)
router.get('/statistics/:openingId', authMiddleware, isAdminMiddleware, getOpeningStatistics);

exports.jobInterestRouter = router;
const express = require('express')
const {
    getAllSelections,
    deleteSelection,
    addSelections
} = require('../controllers/selections.controller.js')
const { authMiddleware } = require('../middlewares/auth.middleware.js')
const { isAdminMiddleware } = require('../middlewares/isAdmin.middleware.js')

const router = express.Router()

/**
 * /api/selection
 */
router
    .get('/getAllSelections',authMiddleware, getAllSelections)
    .delete('/deleteSelection/:_id', authMiddleware, isAdminMiddleware,deleteSelection)
    .post('/addSelections/:_id',authMiddleware, isAdminMiddleware,addSelections)

exports.SelectionRouter = router
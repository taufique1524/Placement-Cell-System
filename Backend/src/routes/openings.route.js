const express = require('express');
const router = express.Router();


const {
    addOpening,
    getAllOpenings,
    deleteOpening,
    getSingleOpening,
    updateOpening
} = require('../controllers/openings.controller.js');


const { isAdminMiddleware } = require('../middlewares/isAdmin.middleware.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');


/**
 * /api/opening
 */

router
    .post('/addOpening', authMiddleware,isAdminMiddleware, addOpening)
    .get('/getAllOpenings', authMiddleware, getAllOpenings)
    .delete('/deleteOpening/:_id', authMiddleware,isAdminMiddleware, deleteOpening)
    .get('/getSingleOpening/:_id',authMiddleware,getSingleOpening)
    .put('/updateOpening/:_id', authMiddleware, isAdminMiddleware, updateOpening)


exports.OpeningsRouter = router
const express = require("express");

const router = express.Router()

const {
    getAllAnnouncements,getSingleAnnouncement, addAnnouncement,getAllResults,addResult, deleteAnnouncement,updateAnnouncement
} = require('../controllers/announcements.controller.js');
const { isAdminMiddleware } = require("../middlewares/isAdmin.middleware.js");

/**
 * /api/announcements
 */
router
    .get('/getallannouncements/:isResults',getAllAnnouncements)
    .post('/addannouncement/:isResults',isAdminMiddleware,addAnnouncement)
    .get('/:_id',getSingleAnnouncement)
    .delete('/:_id',isAdminMiddleware,deleteAnnouncement)  /**using .post() is not recommended + it will cause interference with .post('/addannouncement/:isResults) */
    .patch('/:_id',isAdminMiddleware,updateAnnouncement)
    

exports.AnnouncementsRouter = router
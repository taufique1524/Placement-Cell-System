const { Branch } = require("../models/branch.model.js");
const { Selection } = require("../models/selections.model.js");
const { User } = require("../models/user.models.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const JobInterest = require("../models/jobInterest.model.js");
const mongoose = require('mongoose');


const getAllSelections = asyncHandler(async (req, res) => {
    let selection = await Selection
        .find()
        .sort({ updateAt: -1 })
        .select("+fomattedTime +formattedDate")
        .populate("companyId", "companyName offerType formattedTestDate formattedTestTime")
        .populate({
            path: "studentId",
            select: "name branch image enrolmentNo",
            populate: {
                path: "branch",
                select: "branchCode branchName" // Add the fields you want from the Branch model
            }
        })


    const newSelection = []
    for (let obj of selection) {
        obj = obj.toObject();
        const { studentId: studentDetails, companyId: companyDetails, _id, ...rest } = obj;
        const newObj = { _id, studentDetails, companyDetails, ...rest };
        newSelection.push(newObj)
    }
    // console.log(newSelection);
    res.json({ newSelection });

})

const deleteSelection = asyncHandler(async (req, res) => {
    const { _id } = req.params;
   // console.log("Delete request for selection _id:", _id, "by user:", req.user?._id, "isAdmin:", req.user?.isAdmin);

    const selection = await Selection.findByIdAndDelete(_id);
    if (!selection) {
      //  console.log("Selection not found for _id:", _id);
        return res.status(400).json({ success: 0, message: "Failed to delete: Selection not found." });
    } else {
      //  console.log("Selection deleted for _id:", _id);
        return res.status(200).json({ success: 1, message: "Deleted successfully" });
    }
});
const addSelections = asyncHandler(async (req, res) => {
    const { _id } = req.params; // id of selection

    const enrolmentNoArr = req.body?.enrolmentNo

    const enrolments = []
    let flag = 0;
    enrolmentNoArr.map((ele) => {
        // console.log(typeof ele?.enrolmentNo);
        let enrolmentStr = ele?.enrolmentNo
        // console.log(enrolmentStr);
        if (enrolmentStr === "") {
            flag++;
        }
        else {
            enrolments.push(enrolmentStr);
        }
    })

    if (flag >= 1) {
        res.json({ success: 0, message: "Enrolment No can't be empty" })
        return
    }

    const userIds = [];
    const promise = enrolments.map(async (ele) => {
        try {
            const user = await User.findOne({ enrolmentNo: ele });
            // console.log(user);
            if (!user) {
                return Promise.reject()
            } else {
                userIds.push(user?._id)
                return Promise.resolve()
            }
        } catch (error) {
            // console.log(error);
            return Promise.reject(error)
        }
    })
    Promise.all(promise)
        .then(() => {
            // console.log(enrolments);
            // console.log(userIds);

            const promise2 = userIds.map(async (userId) => {
                try {

                    const selection = new Selection({
                        studentId: userId,
                        companyId: _id
                    })
                    await selection.save()
                    return Promise.resolve()
                } catch (error) {
                    // console.log(error);
                    return Promise.reject(error)
                }
            })

            Promise.all(promise2)
                .then(() => {
                    res.json({ success: 1, message: "Selections added..." });
                })
                .catch(() => {
                    res.json({ success: 0, message: "internal error occured.." });
                })
        })
        .catch(() => {
            res.json({ success: 0, message: "Invalid Enrolment No" });
        })



})

const checkStudentStatus = asyncHandler(async (req, res) => {
    const { openingId, enrolmentNo } = req.query;
    if (!enrolmentNo) {
        return res.status(400).json({ success: 0, message: "Enrolment number is required" });
    }
    try {
        const user = await User.findOne({ enrolmentNo });
        if (!user) {
            return res.status(404).json({ success: 0, message: "Student not found" });
        }
        // Check if placed
        const selection = await Selection.findOne({ studentId: user._id });
        const isPlaced = !!selection;
        // Check if applied for this job
        let hasApplied = false;
        if (openingId) {
            const jobInterest = await JobInterest.findOne({ user: user._id, opening: openingId, isInterested: true });
            hasApplied = !!jobInterest;
        }
        return res.json({
            success: 1,
            isPlaced,
            hasApplied,
            studentName: user.name,
            enrolmentNo: user.enrolmentNo,
            branch: user.branch,
            batch: user.batch
        });
    } catch (error) {
        return res.status(500).json({ success: 0, message: "Error checking student status" });
    }
});

const getAppliedAndShortlisted = asyncHandler(async (req, res) => {
    const { openingId } = req.query;
   // console.log('getAppliedAndShortlisted called with openingId:', openingId);
    if (!openingId) {
        return res.status(400).json({ success: 0, message: "Opening ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(openingId)) {
        return res.status(400).json({ success: 0, message: "Invalid openingId" });
    }
    if (!JobInterest) {
        console.error('JobInterest model is undefined!');
        return res.status(500).json({ success: 0, message: "JobInterest model is not defined" });
    }
    if (!Selection) {
        console.error('Selection model is undefined!');
        return res.status(500).json({ success: 0, message: "Selection model is not defined" });
    }
    try {
        const applied = await JobInterest.find({ opening: openingId, isInterested: true })
            .populate('user', 'name enrolmentNo branch batch');
        const shortlisted = await Selection.find({ companyId: openingId })
            .populate('studentId', 'name enrolmentNo branch batch');
        res.json({
            success: 1,
            applied: applied && applied.length > 0 ? applied.map(a => a.user) : [],
            shortlisted: shortlisted && shortlisted.length > 0 ? shortlisted.map(s => s.studentId) : []
        });
    } catch (error) {
        console.error('Error in getAppliedAndShortlisted:', error);
        res.status(500).json({ success: 0, message: "Error fetching students", error: error.message });
    }
});

module.exports = { getAllSelections, deleteSelection, addSelections, checkStudentStatus, getAppliedAndShortlisted }
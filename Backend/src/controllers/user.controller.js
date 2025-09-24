
// const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
// let users = data.users;


const { User } = require('../models/user.models');
const { uploadOnCloudinary } = require('../utils/FileUploads/claudinary');
const { asyncHandler } = require('../utils/asyncHandler');

exports.getAllUser = asyncHandler(async (req, res) => {
    // console.log('hii');

    let getAdminsOnly = req.params?.getAdminsOnly
    getAdminsOnly = (getAdminsOnly === "false") ? (false) : (true);
    // console.log(getAdminsOnly);

    if (getAdminsOnly === true) {
        // console.log("hiii from boolean");
        const users = await User.find({ isAdmin: getAdminsOnly });

        res.json(users);
    }
    else {
        const users = await User.find();

        res.json(users);
    }



})
exports.getUser = asyncHandler(async (req, res) => {
    const _id = req.params?.id;

    const users = await User.findById(_id).select('-password -refreshToken')
        .populate("branch", "branchName branchCode")
        .exec()

    // console.log(users);

    res.json(users);

})

exports.replaceUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = req.body;
        const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
        res.json(user)
    } catch (error) {
        // console.log(error)
        res.sendStatus(400);
    }
}
exports.updateUser = asyncHandler(async (req, res) => {

    const id = req.params?.id;
    let updatedValues = req.body;

    // console.log(id);


    // trim all values of the formData except for numeric values like cgpa
    for (const [key, value] of Object.entries(updatedValues)) {
        if (key === 'cgpa') {
            // Convert CGPA to number and ensure it's between 0 and 10
            const cgpaValue = parseFloat(value);
            updatedValues[key] = isNaN(cgpaValue) ? 0 : Math.min(Math.max(cgpaValue, 0), 10);
        } else if (typeof value === 'string') {
            const newValue = value.trim().trimStart();
            updatedValues[key] = newValue;
        }
    }

    let flag = 0;
    let error = {}
    Object.entries(updatedValues).forEach(([key, value]) => {
        if (key !== 'resume' && key !== 'cgpa' && value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }
    });

    if (updatedValues?.mobile?.length != 10) {
        // console.log(updatedValues?.mobile?.length);
        error = { ...error, mobileError: "Invalid mobile number" }
        flag++;
    }

    if (flag > 0) {
        return res.json({ success: 0, error });
    }


    //get the current local path of the uploaded image
    // following gives the current local path where the file is uploaded
    let profileImageLocalPath = null // image may not be uploaded
    if (req.files?.profileImage?.length) {
        // if the file is sent fromt the user side then upload it
        profileImageLocalPath = req.files?.profileImage[0]?.path
        // upload the file on cloudinary
        const { url } = await uploadOnCloudinary(profileImageLocalPath)

        updatedValues.image = url;
    }

    



    //    console.log("final val",updatedValues);


    const user = await User.findByIdAndUpdate(id, updatedValues, { new: true });
    res.json({ success: 1, user, error })

})
exports.deleteUser = asyncHandler(async (req, res) => {

    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    res.json(user);

    // console.log(error)
    res.sendStatus(400);

})

// /api/user/loggedInUserDetails
exports.getLoggedInUserDetails = asyncHandler(async (req, res) => {
    
    // Check if req.user exists
    if (!req.user) {
        return res.status(401).json({
            success: 0,
            message: "Authentication failed. User data not available."
        });
    }
    
    const { _id } = req.user;
        
        // Handle potential ObjectId issues
        if (!_id || typeof _id !== 'string' && !_id.toString) {
            return res.status(400).json({
                success: 0,
                message: "Invalid user ID format"
            });
        }
        
        // Convert ObjectId to string if needed
        const userId = typeof _id === 'string' ? _id : _id.toString();
        
        let data = await User.findById(userId)
            .select("-password -refreshToken");
            
        // Instead of using populate which tries to treat branch as ObjectId,
        // we'll manually fetch the branch data if needed
        if (data && data.branch) {
            try {
                const { Branch } = require('../models/branch.model');
                const branchData = await Branch.findOne({ branchCode: data.branch });
                if (branchData) {
                    // Add branch details to the response without modifying the model
                    data = data.toObject();
                    data.branchDetails = {
                        branchName: branchData.branchName,
                        branchCode: branchData.branchCode
                    };
                }
            } catch (branchError) {
            // console.log("Failed to fetch branch details, continuing with user data only:", branchError.message);
            }
        }
            
        if (!data) {
            return res.status(404).json({
                success: 0,
                message: "User not found in database"
            });
        }
        
        return res.json({
            success: 1,
            user: data
        });
})

exports.logout = asyncHandler(async (req, res) => {
    const userDataFromAuthMiddleware = req.user;
    // console.log(userDataFromAuthMiddleware?._id)
    await User.findByIdAndUpdate(
        userDataFromAuthMiddleware?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true // this ensures that only server can modify the cookies... but default anyone can modify it which is not good
    }


    console.log('User logged out succefully');

    res.status(200)
        .clearCookie('accessToken', option)
        .clearCookie('refreshToken', option)
        .json({
            success: 1,
            message: 'User logged out succefully'
        })

})

exports.changePassword = asyncHandler(async (req, res) => {

    const { password, newPassword, confirmNewPassword } = req.body;
    // console.log(req.body);
    const updatedValues = req.body
    let flag = 0;
    let error = {}
    Object.entries(updatedValues).forEach(([key, value]) => {
        if (value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }
    });

    if (flag) {
        return res.json({
            sucess: 0,
            errors: error,
            message: ""
        })
    }


    if (newPassword !== confirmNewPassword) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Confirm new password and new password not matching"
            },
            message: ""
        })
    }

    if (password === newPassword) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Please type a password different from current password!!"
            },
            message: ""
        })
    }

    const id = req.user?._id;
    const user = await User.findById(id);

    if (!user) {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Unauthorized access"
            },
            message: ""
        })
    }

    const isMatch = await user.isPasswordCorrect(password)

    if (isMatch === true) {
        user.password = newPassword;
        await user.save({ validateBeforeSave: false })
        return res
            .status(200)
            .json({
                sucess: 1,
                message: "password changed successfully!!!",
                errors: {}
            })
    }
    else {
        return res.json({
            sucess: 0,
            errors: {
                otherError: "Wrong old password"
            },
            message: ""
        })
    }

})

// Update only resume/profile fields for the logged-in user
exports.updateResumeProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {
        academicDetails,
        skills,
        projects,
        internships,
        achievements,
        careerObjective,
        resumeTemplateId,
        linkedIn,
        github,
        instagram
    } = req.body;

    // Build update object
    const update = {};
    if (academicDetails) update.academicDetails = academicDetails;
    if (skills) update.skills = skills;
    if (projects) update.projects = projects;
    if (internships) update.internships = internships;
    if (achievements) update.achievements = achievements;
    if (careerObjective) update.careerObjective = careerObjective;
    if (resumeTemplateId) update.resumeTemplateId = resumeTemplateId;
    if (linkedIn !== undefined) update.linkedIn = linkedIn;
    if (github !== undefined) update.github = github;
    if (instagram !== undefined) update.instagram = instagram;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    res.json({ success: 1, user });
});
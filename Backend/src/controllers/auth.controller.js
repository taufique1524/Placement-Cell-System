

const jwt = require("jsonwebtoken")
const { User } = require('../models/user.models');
const getHtml = require('../utils/Mails/RegistrationEmails/htmlEmailBody.js');
const sendRegistrationEmail = require('../utils/Mails/RegistrationEmails/registrationEmail.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const sendForgotPasswordEmail = require("../utils/Mails/ForgotPasswordEmails/forgotPasswordEmail.js");
const getForgotPasswordHtml = require("../utils/Mails/ForgotPasswordEmails/htmlForgotPassword.js");


exports.createUser = asyncHandler(async (req, res) => {

    // console.log(req.file);

    let formData = req.body
    // console.log("req.body");
    // console.log(req.body);
    formData.password = formData.dob; // initially password is set as dob YYYY-MM-DD
    
    // trim all values of the formData
    for (const [key, value] of Object.entries(formData)) {
        const newValue = value.trim().trimStart()
        formData[key] = newValue;
    }

    let flag = 0;
    let error = {}
    
    Object.entries(formData).forEach(([key, value]) => {
        if (value === "") {
            const newKey = key.toString() + "Error";
            error = { ...error, [newKey]: `${key} can't be empty` };
            flag++;
        }
    });

    const { password, name, email, enrolmentNo, mobile, gender,
        batch, branch, dob } = formData

    if (password.length < 4) {
        error = { ...error, confirmPasswordError: "Passwords must be of 4 or more characters" }
        flag++;
    }
    
    if (mobile.length != 10) {
        error = { ...error, mobileError: "Invalid mobile number" }
        flag++;
    }

    if(formData.branch === "Not Selected"){
        error = {...error,branchError:"Branch can't be empty"}
        flag++;
    }

    let checkUser = await User.findOne({ enrolmentNo });
    if (checkUser) {
        error = { ...error, enrolment_NoError: "Enrolment no already is use!!" }
        flag++;
    }

    checkUser = await User.findOne({ email });
    if (checkUser) {
        error = { ...error, emailError: "email already in use!!" }
        flag++;
    }

    
    if (flag > 0) {
        // console.log("erorr: ",error);
        return res.json({ success: 0, error });
        // throw new apiError(error,"messae from me", 500)
    }


    const user = new User({
        email,
        name,
        enrolmentNo,
        gender,
        batch,
        branch,
        mobile,
        dob,
        password,
        dob
    });
    await user.save();

    // console.log("dob: ",dob);

    //send email for successfull registration
    const to = email
    const subject = `Registration for Placements Sucessful`
    const text = ``
    const html = getHtml(name,password,email)


    // console.log("dhjsbdsv::","info");
    const info  = await sendRegistrationEmail(to,subject,text,html);
    // console.log("dhjsbdsv::",info);
    //not safe to send password and token to user as response so remove them from object
    let { password: omit_pass, token, ...restObj } = formData
    // since password is already used as a name for var we used `password:omit_pass`
    // console.log("User Registered Successfully")
    // console.log(restObj)
    res.json({ user: restObj, success: 1, successMessage: "User Registered Successfully" });

})

const generateAccessAndRefreshToken = async (user_id) => {
    try {
        // Find user by ID
        let user = await User.findById(user_id);
        if (!user) {
            throw new Error("User not found");
        }
        
        // Generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        if (!accessToken || !refreshToken) {
            throw new Error("Token generation failed");
        }
        
        // Store refresh token in user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw error; // Re-throw to be handled by the caller
    }
}
exports.login = asyncHandler(async (req, res) => {

    // console.log("req.body");
    // console.log(req.body);
    let { email, password } = req.body;

    //trim the values
    email = email.trim().trimStart().toLowerCase()
    password = password.trim().trimStart()

    if (email === "") {
        return res.json({ success: 0, error: { emailError: "email can't be empty" } });
    }
    if (password === "") {
        return res.json({ success: 0, error: { passwordError: "password can't be empty" } });
    }


    const user = await User.findOne({ email })
    if (user) {
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: 0,
                error: { emailError: "Email not verified. Please verify your email before logging in." }
            });
        }
        // console.log(user.password)
        const isMatch = await user.isPasswordCorrect(password);

        if (isMatch === true) {
            try {
                // Generate tokens
                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
                // No longer using cookies, so this is just kept for reference
                const option = {
                    httpOnly: true,
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                }
                
                // Prepare user data to be sent as response
                const { password: omit_pass, refreshToken: omitRefreshToken, ...responseData } = user.toObject();
                
                // Add token to the response data
                responseData.token = accessToken;
                
                return res.status(200).json({ 
                    success: 1, 
                    message: "Login successful", 
                    error: {}, 
                    user: responseData 
                });
            } catch (tokenError) {
                return res.status(500).json({
                    success: 0,
                    error: { otherError: "Error generating authentication token. Please try again." }
                });
            }
        }
        else {
            res.json({ success: 0, error: { passwordError: "Wrong password" } });
        }
    }
    else {
        res.json({ success: 0, error: { emailError: "User does not exist" } });
        // res.send("<>hdbcd</>")
    }

})


// reset password for the case of forgot password 
exports.resetForgotPassword = asyncHandler(async(req,res)=>{
    let {email} = req.body;
    email = email.trim().trimStart();
    // console.log("sds");

    let user = await User.find({email})
    user = user[0];
    if(user){
        // console.log(user);
        const {_id,email,password} = user;
        const secret = process.env.FORGOTPASSWORD_JWT_SECRET+password;
        // console.log("1: -> ",secret);
        const payload = {
            email,
            password,
            id:_id
        }
        const token =  jwt.sign(payload,secret,{expiresIn:'4h'}); // token expires in 4hrs
        const resetLink = `${process.env.FRONTEND_URL}/reset/${_id}?token=${token}`

        //send email
        const to = email
        const subject = "Account Password Reset"
        const text = ''
        const html = getForgotPasswordHtml(resetLink);

        await sendForgotPasswordEmail(to,subject,text,html);

        res.json({success:1,message:"Mail sent Sucessfully!!"});
    }
    else{
        res.json({success:0,message:"Email does not exist!!!!"})
    }
})


exports.resetFinalForgotPassword = asyncHandler(async(req,res)=>{
    const {id,token} = req.params
    let {confirmPassword,password} = req.body

    confirmPassword = confirmPassword.trim().trimStart()
    password = password.trim().trimStart()

    //form validation
    if(password!==confirmPassword){
        res.json({success:0,message:"Password and ConfirmPassword not matching!!!"})
        return;
    }

    if(password.length<4){
        res.json({success:0,message:"Password must be of atleast 4 characters!!!"})
        return;
    }

    let user = await User.find({_id:id});
    user = user[0];

    if(!user){
        res.json({success:0,message:"Invalid reset link!!"})
        return;
    }

    // verify token
    const secret = process.env.FORGOTPASSWORD_JWT_SECRET+user.password

    const decoded = jwt.verify(token,secret);

    if(!decoded){
        res.json({success:0,message:"Invalid reset link!!!!!"})
        return;
    }

    user.password = password
    await user.save({validateBeforeSave:false})

    res.json({success:1,message:"Password Changed Successfully!!!"})



})



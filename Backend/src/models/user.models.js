const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const constants = require('../constants.js');
const jwt = require('jsonwebtoken');


const UserSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is mandatory'], trim: true, index: true },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            },
            required: [true, 'User email is required'],
            unique: [true, 'Email already used'],
            trim: true,
            index: true, // makes the search on the basis of email (this property) optimised
            lowercase: true
        },
        branch: { type: String, required: true, trim: true },
        mobile: { type: String, required: true, trim: true },
        batch: { type: String, required: true, trim: true },
        gender: { type: String, required: true, trim: true },
        dob: { type: Date, required: [true, 'DOB value is mandatory'] },
        enrolmentNo: {
            type: String,
            required: [true, 'enrolmentNo is mandatory'],
            unique: true,
            trim: true,
            index: true, // makes the search on the basis of email (this property) optimised
        },
        password: {
            type: String,
            required: [true, 'password value is mandatory'],
            trim: true
        },
        userType:{
            type:String,
            default:'student'
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        image: {
            type: String,
            default: ""
        },
        resume: {
            type: String,
            default:""
        },
        // --- Resume Builder Fields Start ---
        academicDetails: {
            tenth: {
                board: { type: String, default: "" },
                year: { type: String, default: "" },
                percentage: { type: String, default: "" }
            },
            twelfth: {
                board: { type: String, default: "" },
                year: { type: String, default: "" },
                percentage: { type: String, default: "" }
            },
            ug: {
                college: { type: String, default: "" },
                degree: { type: String, default: "" },
                cgpa: { type: String, default: "" }
            }
        },
        skills: {
            type: [String],
            default: []
        },
        projects: [
            {
                title: { type: String, default: "" },
                description: { type: String, default: "" },
                link: { type: String, default: "" }
            }
        ],
        internships: [
            {
                company: { type: String, default: "" },
                role: { type: String, default: "" },
                duration: { type: String, default: "" },
                description: { type: String, default: "" }
            }
        ],
        achievements: {
            type: [String],
            default: []
        },
        careerObjective: {
            type: String,
            default: ""
        },
        resumeTemplateId: {
            type: String,
            default: "classic"
        },
        // --- Resume Builder Fields End ---
        linkedIn: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        cgpa: {
            type: Number,
            default: 0
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationOTP: {
            type: String,
            default: null
        },
        emailVerificationOTPExpires: {
            type: Date,
            default: null
        }
    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
        timestamps: true, // this will automatically create two more entries in user table named as "createdAt" and "updatedAt"
       
    }
)

// .pre is a middleware that runs a given function just before the specified event
UserSchema.pre("save", async function (next) { // the arrow function will not work here because it does not have "this" (current context) in its params
    if (this?.isModified("password") === true) { // isModified is a built in function that keeps track of modified fields.
        this.password = await bcrypt.hash(this.password, constants.bcrypt_salt_rounds);
    }
    next();

})
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}
UserSchema.methods.isPasswordValid = async function () {
    return true;
}

UserSchema.methods.generateAccessToken = async function () {
    try {
        // Convert ObjectId to string to avoid serialization issues
        const userId = this._id.toString();
        
        const token = jwt.sign(
            {
                _id: userId,
                email: this.email,
                enrolmentNo: this.enrolmentNo,
                isAdmin: this.isAdmin
            },
            process.env.ACCESS_TOKEN_SECRET || 'mysecretaccesstoken123',
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
            }
        );
        
        return token;
    } catch (error) {
        throw error;
    }
}

UserSchema.methods.generateRefreshToken = async function () {
 //   console.log("Generating refresh token for user:", this._id);
    
    // Make sure we have a valid secret
    const secret = process.env.REFRESH_TOKEN_SECRET || 'mysecretrefreshtoken456';
    const expiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    
   // console.log("Using refresh token expiry:", expiry);
    
    try {
        // Convert ObjectId to string to avoid serialization issues
        const userId = this._id.toString();
        
        const token = jwt.sign(
            {
                _id: userId,
                email: this.email,
                isAdmin: this.isAdmin
            },
            secret,
            {
                expiresIn: expiry
            }
        );
        
      //  console.log("Refresh token generated successfully");
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw error;
    }
}


UserSchema.virtual('formattedDOB').get( function(){
    let dob =  this?.dob 
    // console.log("dob+",dob);

    /**
     * for populating if virtual attribute is not selected then it will give an error
        because mongodb will try to add virtual object from some object which is not present in
        the result
     * to avoid this always add a conditional check in before creating a virtual object
     */

    if(!dob) return null;

    dob = dob.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'})
    // console.log("dob+2",dob);

    return dob
})

exports.User = mongoose.model('User', UserSchema) // it will create a db as users automatically



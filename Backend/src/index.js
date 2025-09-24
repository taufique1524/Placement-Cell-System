const dotenv = require('dotenv')
const cors = require('cors')
// const cookieParser = require('cookie-parser');
// const fs = require('fs')
const express = require('express');
const path = require('path');


const server = express();
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});


const { dbConnection } = require('./db/connection.db.js')
const { authMiddleware } = require('./middlewares/auth.middleware.js')
const {isAdminMiddleware} = require('./middlewares/isAdmin.middleware.js')

//db connection
const { createDefaultAdminIfNone } = require('./utils/createDefaultAdmin');
const { createDefaultBranchesIfNone } = require('./utils/createDefaultBranches');

dbConnection()
    .then(async () => {
        // Initialize default data after successful connection
        await createDefaultBranchesIfNone();
        await createDefaultAdminIfNone();
    })
    .catch((err) => {
        // console.log("db connection failed \n", err);
    });


const allowedOrigins = [
  process.env.CORS_ALLOWED_ORIGINS,
  'https://p-cell-xfji.vercel.app',
  'http://localhost:5173',
  'https://p-cellbackend.vercel.app'
];

server.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

server.use(express.json());

// we are not using any cookies
// server.use(cookieParser({
//     credentials: true,
//     httpOnly: true,
// }));
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

// Add a simple endpoint to check if the server is running
server.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Add a test endpoint for token verification
const { testTokens } = require('./utils/testTokens');
server.get('/test-tokens', (req, res) => {
    const result = testTokens();
    res.json(result);
});

// Add a direct endpoint to verify a token from the request
const jwt = require('jsonwebtoken');
server.get('/verify-token', (req, res) => {
    try {
        // Get token from header - check all possible headers
        let token = req.header("token") || 
                   req.header("Authorization") || 
                   req.header("authorization") || 
                   req.query.token || 
                   null;
        
        // If no token provided
        if (!token) {
            return res.status(400).json({
                success: 0,
                message: "No token provided"
            });
        }
        
        // Extract token if it has Bearer prefix
        let tokenToVerify = token;
        if (token.startsWith('Bearer ')) {
            tokenToVerify = token.slice(7);
        }
        
        // Verify the token
        const secret = process.env.ACCESS_TOKEN_SECRET || 'mysecretaccesstoken123';
        
        try {
            const decoded = jwt.verify(tokenToVerify, secret);
            
            // Check if the decoded token has the required fields
            if (!decoded || !decoded._id) {
                return res.status(401).json({
                    success: 0,
                    message: "Invalid token: Missing required fields"
                });
            }
            
            return res.json({
                success: 1,
                message: "Token is valid",
                decoded
            });
        } catch (jwtError) {
            return res.status(401).json({
                success: 0,
                message: "Invalid token: " + jwtError.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Error processing token verification request"
        });
    }
});

// Add a root route '/' that returns a friendly message to avoid 404 errors when visiting the backend root URL.
server.get('/', (req, res) => {
  res.send('Backend API is running.');
});

// routers import

const { userRoute } = require('./routes/user.route.js')
const { authRoute } = require('./routes/auth.route.js');
const { AnnouncementsRouter } = require('./routes/announcements.route.js');
const { CommentsRouter } = require('./routes/comments.route.js');
const { OpeningsRouter } = require('./routes/openings.route.js');
const { SelectionRouter } = require('./routes/selections.route.js');
const { BranchRouter } = require('./routes/branch.route.js');
const { jobInterestRouter } = require('./routes/jobInterest.route.js');


//router declaration
server.use('/auth', authRoute);
server.use('/api/user',authMiddleware, userRoute);
server.use('/api/announcements', authMiddleware, AnnouncementsRouter); // this is route for both all announcements and results
server.use('/api/comments',authMiddleware, CommentsRouter); //comments route
server.use('/api/opening',OpeningsRouter)
server.use('/api/selection',SelectionRouter)
// server.use('/api/selection',SelectionRouter)
server.use('/api/branch',BranchRouter)
server.use('/api/job-interest', jobInterestRouter)


// // -------------------DEployment code------

// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV === 'production'){
//     server.use(express.static(path.join(__dirname1,"/frontend/dist")))
//     server.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname1,"frontend","dist","index.html"))
//     })
// }
// // -------------------



server.listen(process.env.PORT, (error) => {
    console.log('server started..' + process.env.PORT)
})




# 📌 **P\_Cell — Placement Management System**
## 📄 **Project Description**

**P\_Cell** is a comprehensive Placement Management System designed for academic institutions to streamline and digitize the entire campus placement process. It enables students, admins, and company representatives to manage job openings, applications, selections, and communication efficiently. The platform solves the problem of manual, error-prone placement workflows by providing a centralized, transparent, and user-friendly web application.

**✨ Unique Value:**

*  Real-time, role-based dashboards for students and admins.
*  Automated eligibility checks, application tracking, and selection management.
*  Secure, modern tech stack with a focus on scalability and maintainability.


## 🚀 **Features**

### 🎓 **For Students**

*  **Profile Management:** Update personal, academic, and resume details.
*  **Job Openings:** View all available openings, eligibility status, and apply directly.
*  **Resume Preview:** Generate and preview resumes in a standardized format.
*  **Application Tracking:** See which jobs you’ve applied for and your selection status.
*  **Peer Resume Viewing:** View resumes of other students (if permitted).

### 🛠️ **For Admins**

*  **User Management:** Add, edit, or remove students and admins.
*  **Openings Management:** Create, edit, and delete job openings.
*  **Selections Management:** Shortlist students for jobs, with real-time status updates.
*  **Statistics & Analytics:** View applied, shortlisted, and not-interested students for each job.
*  **Bulk Operations:** Add multiple selections, manage branches, and initialize admin accounts.

### 💬 **Communication & Collaboration**

*  **Announcements:** Post and manage placement-related announcements.
*  **Comments:** Students and admins can comment on announcements for clarifications.
*  **Email Notifications:** Automated emails for registration, password reset, and important updates.

### 🔐 **Security & Access Control**

*  **Role-Based Access:** Separate interfaces and permissions for students and admins.
*  **Authentication:** Secure login, registration, and password management.


## 🧩 **Tech Stack**

### ⚛️ **Frontend**

* **React.js:** Modern, component-based UI for a responsive and dynamic experience.
* **Tailwind CSS:** Utility-first CSS framework for rapid, consistent styling.
* **Vite:** Fast build tool for optimized development and production builds.
* **Axios:** Promise-based HTTP client for API communication.
* **React Router:** Declarative routing for single-page application navigation.

### 🖥️ **Backend**

* **Node.js & Express.js:** Robust server-side framework for RESTful APIs.
* **MongoDB & Mongoose:** NoSQL database with schema modeling for flexibility and scalability.
* **JWT:** Secure authentication and authorization.
* **Cloudinary:** Image upload and management for user profile pictures.
* **Nodemailer:** Email service for notifications and password resets.

### ⚙️ **Tooling & DevOps**

* **ESLint:** Code linting for consistent code quality.
* **Vercel:** Deployment for the frontend.
* **Environment Variables:** Secure configuration for sensitive data.

**💡 Why These Choices?**

* Chosen for their popularity, community support, scalability, and ease of integration in modern web applications.


## ⚙️ **Installation**

### ✅ **Prerequisites**

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB (local or cloud instance)

### 🔧 **Backend Setup**

```bash
cd Backend
npm install
# Create a .env file with your MongoDB URI, JWT secret, and other configs
npm start
```

### 🎨 **Frontend Setup**

```bash
cd Frontend
npm install
# Create a .env file if needed (e.g., for API base URL)
npm run dev
```

### 🔑 **Environment Variables**

**Backend/.env**

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
PORT=5000
FORGOTPASSWORD_JWT_SECRET=
FRONTEND_URL=http://localhost:5173

```

**Frontend/.env (optional)**

```
VITE_API_BASE_URL=http://localhost:5000
VITE_BACKEND_PORT=5000
VITE_FRONTEND_PORT=5173
VITE_FORGOTPASSWORD_JWT_SECRET=
```


## 🏃 **Usage**

### ⚡ **Running Locally**

1. **Start MongoDB** (if running locally)
2. **Start Backend**

   ```bash
   cd Backend
   npm start
   ```
3. **Start Frontend**

   ```bash
   cd Frontend
   npm run dev
   ```
4. **Access the app:**

   * Student/Admin: [http://localhost:5173](http://localhost:5173)
   * API: [http://localhost:5000/api](http://localhost:5000/api)


## 📁 **Folder Structure**

```
P_Cell/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/      # API controllers (business logic)
│   │   ├── models/           # Mongoose models (User, Opening, Selection, etc.)
│   │   ├── routes/           # Express route definitions
│   │   ├── middlewares/      # Auth, admin, file upload, etc.
│   │   ├── utils/            # Utility functions (email, error handling)
│   │   ├── db/               # Database connection
│   │   └── index.js          # App entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── pages/            # Main page components (Dashboard, Profile, etc.)
│   │   ├── components/       # Reusable UI components (Sidebar, Modal, etc.)
│   │   ├── services/         # API service functions
│   │   ├── context/          # React context for global state
│   │   ├── utils/            # Utility functions
│   │   ├── assets/           # Images and static assets
│   │   └── App.jsx           # Main app component
│   └── package.json
│
└── README.md
```


## 🗂️ **Frontend Page Routes**

| Route                       | Page/Component           | Description                               | Access        |
| --------------------------- | ------------------------ | ----------------------------------------- | ------------- |
| `/`                         | `LoginPage`              | Login for students and admins             | Public        |
| `/registration`             | `RegistrationPage`       | Student registration                      | Public        |
| `/public-registration`      | `PublicRegistrationPage` | Public registration (if enabled)          | Public        |
| `/userprofile`              | `UserProfilePage`        | Student profile dashboard                 | Student       |
| `/updateUser/:id`           | `UpdateUserDataPage`     | Edit user profile                         | Student/Admin |
| `/resume-preview`           | `ResumePreviewPage`      | Preview logged-in user's resume           | Student       |
| `/resume-preview/:userId`   | `ResumePreviewPage`      | Preview another user's resume             | Student/Admin |
| `/openings`                 | `OpeningsPage`           | List all job openings                     | Student/Admin |
| `/addOpening`               | `AddOpeningPage`         | Add a new job opening                     | Admin         |
| `/editOpening/:id`          | `EditOpeningPage`        | Edit a job opening                        | Admin         |
| `/addSelections/:openingId` | `AddSelectionsPage`      | Add or manage selected students for a job | Admin         |
| `/allSelections`            | `AllSelectionsPage`      | View all selected/placed students         | Student/Admin |
| `/alluser`                  | `AllUsersPage`           | List all users                            | Admin         |
| `/alladmin`                 | `AllAdminPage`           | List all admins                           | Admin         |
| `/announcements`            | `AllAnnouncementPage`    | List all announcements                    | Student/Admin |
| `/editAnnouncement/:id`     | `EditAnnouncementsPage`  | Edit an announcement                      | Admin         |
| `/results`                  | `ResultsPage`            | View placement results                    | Student/Admin |
| `/editResults/:id`          | `EditResultsPage`        | Edit placement results                    | Admin         |
| `/singleAnnouncement/:id`   | `SingleAnnouncementPage` | View a single announcement                | Student/Admin |
| `/singleOpening/:id`        | `SingleOpeningPage`      | View a single job opening                 | Student/Admin |
| `/verify-email`             | `VerifyEmailPage`        | Email verification                        | Public        |
| `/verify-existing-user`     | `VerifyExistingUserPage` | Existing user verification                | Public        |
| `/forgot-password`          | `ForgotPassword`         | Password reset request                    | Public        |
| `/reset-password`           | `ResetPasswordPage`      | Reset password                            | Public        |

---

## 🗂️ **About the Routes**

* Most routes are protected and require authentication. Role-based access ensures only authorized users can access admin or student features.
* Dynamic routes (e.g., `/updateUser/:id`) use the user or opening ID for context-specific pages.
* Public routes are accessible without login for registration, password reset, and verification.


## 📊 **Entity Relationship Diagram**

*(Add your ER diagram image or code block here)*

![Alt text]()



## 🤝 **Contributing**

We welcome contributions! To get started:

1. Fork this repo
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a pull request

**Guidelines:**

* Follow the existing code style and naming conventions.
* Write clear, descriptive commit messages.
* Ensure all tests pass before submitting a PR.
* For major changes, open an issue first to discuss your proposal.


## 📬 Contact

**Developed By:** *Owaish Jamal*
**GitHub:** [owaishjamal](https://github.com/owaishjamal)
**LinkedIn:** [owaish-jamal-a99a091aa](https://www.linkedin.com/in/owaish-jamal-a99a091aa/)
**Email:** [owaishjamal98@gmail.com](mailto:owaishjamal98@gmail.com)


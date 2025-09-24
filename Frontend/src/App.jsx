import "./App.css";

import Login from "./pages/LoginPage.jsx";
import Registration from "./pages/RegistrationPage.jsx";
import PublicRegistrationPage from "./pages/PublicRegistrationPage.jsx";
import TestUserRedirect from "./TestUserRedirect.jsx";
import AuthRedirect from "./pages/AuthRedirect.jsx";
import TokenDebugger from "./pages/TokenDebugger.jsx";
import ProfileCard from "./components/ProfileCard";
import AllAnnouncement from "./pages/AllAnnouncementPage.jsx";
import SingleAnnouncement from "./pages/SingleAnnouncementPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import OpeningsPage from "./pages/OpeningsPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AllUsersPage from "./pages/AllUsersPage.jsx";
import AllAdminPage from "./pages/AllAdminPage.jsx"
import EditAnnouncementsPage from "./pages/EditAnnouncementsPage.jsx";
import EditResultsPage from "./pages/EditResultsPage.jsx";
import OtherUserProfilePage from "./pages/OtherUserProfilePage.jsx";
import UpdateUserDataPage from "./pages/UpdateUserDataPage.jsx";
import AddOpeningPage from "./pages/AddOpeningPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import SingleOpeningPage from "./pages/SingleOpeningPage.jsx";
import AddSelectionsPage from "./pages/AddSelectionsPage.jsx";
import AllSelectionsPage from "./pages/AllSelectionsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import VerifyExistingUserPage from "./pages/VerifyExistingUserPage.jsx";
import ResumeProfileForm from "./pages/ResumeProfileForm.jsx";
import ResumePreviewPage from "./pages/ResumePreviewPage.jsx";
import EditOpeningPage from "./pages/EditOpeningPage.jsx";

import { RouterProvider,Route,createRoutesFromElements, createBrowserRouter } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CacheDemo from "./pages/CacheDemo.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<AuthRedirect />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<PublicRegistrationPage />} />
      <Route path="registration" element={<Registration />} />
      <Route path="forgotPassword" element={<ForgotPassword/>}/>
      <Route path="reset/:id" element={<ResetPasswordPage/>}/>
      <Route path="errorPage/:message" element={<ErrorPage/>}/>
      <Route path="verify-email" element={<VerifyEmailPage />} />
      <Route path="verify-existing-user" element={<VerifyExistingUserPage />} />
      <Route path="*" element={<PageNotFound/>}/>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="test-user-redirect" element={<TestUserRedirect />} />
        <Route path="auth" element={<AuthRedirect />} />
        <Route path="debug-token" element={<TokenDebugger />} />
        <Route path="profile" element={<ProfileCard/>}/>
        <Route path="allannouncements" element={<AllAnnouncement/>}/>
        <Route path="singleannouncement/:_id" element={<SingleAnnouncement/>}/>
        <Route path="results" element={<ResultsPage/>}/>
        <Route path="openings" element={<OpeningsPage/>}/>
        <Route path="userprofile" element={<UserProfilePage/>}/> {/**my profile */}
        <Route path="resume-builder" element={<ResumeProfileForm/>}/> {/**resume builder */}
        <Route path="resume-preview" element={<ResumePreviewPage/>}/> {/**resume preview */}
        <Route path="resume-preview/:userId" element={<ResumePreviewPage/>}/> {/**resume preview for any user by id */}
        <Route path="alluser" element={<AllUsersPage/>}/>
        <Route path="alladmins" element={<AllAdminPage/>}/>
        <Route path="editAnnouncement/:id" element={<EditAnnouncementsPage/>} />
        <Route path="editResults/:id" element={<EditResultsPage/>} />
        <Route path="updateUser/:id" element={<UpdateUserDataPage/>} />
        <Route path="changePassword" element={<ChangePasswordPage/>} />
        <Route path="addOpening" element={<AddOpeningPage/>} />
        <Route path="editOpening/:id" element={<EditOpeningPage/>} />
        <Route path="singleOpening/:_id" element={<SingleOpeningPage/>} />
        <Route path="addSelections/:_id" element={<AddSelectionsPage/>} />
        <Route path="allSelections" element={<AllSelectionsPage/>} />
        <Route path="otheruserprofile/:id" element={<OtherUserProfilePage/>} /> {/**profile of other user*/}
        <Route path="cache-demo" element={<CacheDemo />} />
      </Route>
    </Route>
  )
);
function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;

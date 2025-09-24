import React from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useData } from '../context/DataContext.jsx';

function AllAdminPage({ className = "" }) {
  const { users = [], user: loggedInUserDetails = {} } = useData();
  const allAdmins = users.filter(u => u.isAdmin);

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className="mt-20 flex justify-center text-xl text-blue-900 ">
        All Admins
      </div>
      <div
        className={`mx-auto justify-center bg-blue-50 flex flex-row flex-wrap ${className}`}
      >
        {allAdmins?.map((ele, ind) => {
          return (
            <ProfileCard
              key={ind}
              userData={ele}
              className="ml-16 mb-4"
            ></ProfileCard>
          );
        })}
      </div>
    </Sidebar>
  );
}

export default AllAdminPage;

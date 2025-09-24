import React from "react";
import ProfileCard from "../components/ProfileCard";
import Sidebar from "../components/Sidebar.jsx";
import { useData } from '../context/DataContext.jsx';

function AllUsersPage({ className = "" }) {
  const { users: allUsersData = [], user: loggedInUserDetails = {} } = useData();

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className="mt-20 flex justify-center text-xl text-blue-900 ">All Users</div>
      <div
        className={`mx-auto justify-center mt-0 bg-blue-50 flex flex-row flex-wrap ${className}`}
      >
        {allUsersData?.map((ele) => {
          return (
            <ProfileCard
              key={ele?._id || Math.random().toString(36).substr(2, 9)}
              loggedInUserDetails={loggedInUserDetails}
              userData={ele}
              className="ml-16 mb-4"
            ></ProfileCard>
          );
        })}
      </div>
    </Sidebar>
  );
}

export default AllUsersPage;

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";
import SingleOpening from "../components/SingleOpening.jsx";
import WriteComment from "../components/WriteComment.jsx";
import Comments from "../components/Comments";
import JobInterestStats from "../components/JobInterestStats";
import { getAllComments } from "../services/getAllComments.services.js";
import { getSingleOpening } from "../services/getSingleOpening.services.js";
import { handleClick } from "../handlers/singleOpeningPage.handler.js";
import { useNavigate, useParams } from "react-router-dom";
function SingleOpeningPage() {
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [comments, setComments] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [opening, setOpening] = useState({});
  const navigate = useNavigate()
  const { _id } = useParams();
  const id = _id;
  useEffect(() => {
    async function loadSingleOpening(id){
        try{
            const data = await getSingleOpening(id);
            setOpening(data);
        }
        catch(error){
            console.log(error);
        }
    }
    loadSingleOpening(id);

    async function loadLoggedInUserDetails() {
      try {
        const data = await getLoggedInUserDetails();
        setLoggedInUserDetails(data);
      } catch (error) {
        console.log(error);
        navigate('/')
      }
    }
    loadLoggedInUserDetails();
    
    async function loadAllComments(id) {
      try {
        const data = await getAllComments(id);
        setAllComments(data);
      } catch (error) {
        console.log(error);
        navigate('/errorPage/Internal Error')
      }
    }
    loadAllComments(id);
  }, []);
  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className="flex flex-col lg:flex-row mt-20 w-full">
        <div className={`lg:w-[70%] md:w-full sm:w-[100%] rounded-lg p-4`}>
          <SingleOpening obj={opening}>
            <WriteComment
              value={comments}
              setValue={setComments}
              handleClick={(e) => {
                handleClick(e, comments, setComments, setAllComments, id);
              }}
            ></WriteComment>
          </SingleOpening>
        </div>
        
        {/* Show statistics for admins */}
        {loggedInUserDetails?.isAdmin && (
          <div className="lg:w-[30%] md:w-full sm:w-[100%] p-4">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Job Interest Statistics</h2>
            <JobInterestStats openingId={id} />
          </div>
        )}
      </div>
      <Comments
        commentsArray={allComments}
        setCommentsArray={setAllComments}
        loggedInUserDetails={loggedInUserDetails}
        className="mt-10 lg:w-[68%] sm:w-full md:w-full"
      ></Comments>
    </Sidebar>
  );
}

export default SingleOpeningPage;

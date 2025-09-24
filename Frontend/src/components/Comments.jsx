import React, { useState } from "react";
import MessageCard from "./MessageCard";
import { MdDelete } from "react-icons/md";
import { deleteHandler } from "../handlers/deleteComment.handler.js";

function Comments({ commentsArray, setCommentsArray, className = "" ,loggedInUserDetails}) {
  console.log(commentsArray);
  return (
    <div
      className={`w-[80%] flex flex-col justify-center rounded-lg border border-gray-200 bg-white  ${className}`}
    >
      <div className="mb-0 flex justify-center w-full p-2">
        <b>Comments</b>
      </div>
      <div className="w-full">
        {commentsArray?.map((obj,ind) => {
          obj.isResultsAnnouncement = 1;
          return (
            <div
              key={ind}
              className="flex flex-col justify-center w-full mb-2"
            >
              <MessageCard obj={obj} className="rounded-full p-0 m-0">
                <button
                  className="m-0 pt-2"
                  onClick={() => {
                    deleteHandler(obj?._id,commentsArray,setCommentsArray);
                  }}
                >
                  {loggedInUserDetails?._id === obj?.writer?.id && (<MdDelete color="red" size={20} />)}
                  
                </button>
              </MessageCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Comments;

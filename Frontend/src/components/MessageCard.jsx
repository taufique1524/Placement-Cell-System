import React from "react";
import userPic from "../assets/profile_pic_placeholder.jpeg";
import { Link } from "react-router-dom";

function MessageCard({ className = "", children, obj }) {
  // console.log("obj from message card");
  // console.log(obj);
  return (
    <div
      className={`relative w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col gap-3 transition-shadow duration-200 hover:shadow-2xl hover:bg-white/90 ${className}`}
      style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #e0e7ff 100%)" }}
    >
      <div className="flex items-center gap-5 mb-3">
        <img
          src={obj?.writer?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
          alt="pic"
          className="w-14 h-14 rounded-full border-4 border-blue-200 shadow-md object-cover bg-white"
        />
        <div className="flex flex-col">
          <span className="font-bold text-lg text-blue-900 leading-tight">{obj?.writer?.name}</span>
          <span className="text-xs text-blue-600 font-medium mt-1">{obj?.writer?.isAdmin === true ? "Admin" : "Student"}</span>
        </div>
        <div className="ml-auto text-right flex flex-col items-end">
          <span className="text-xs text-gray-400 font-semibold">{obj?.formattedDate}</span>
          <span className="text-xs text-gray-400 font-semibold">{obj?.formattedTime}</span>
        </div>
      </div>
      <hr className="my-2 border-blue-100" />
      <div className="text-lg text-gray-800 mb-2 whitespace-pre-line break-words font-medium tracking-wide">
        {obj?.content}
      </div>
      <hr className="my-2 border-blue-100" />
      <div className="flex items-center justify-between w-full mt-2">{children}</div>
    </div>
  );
}

export default MessageCard;

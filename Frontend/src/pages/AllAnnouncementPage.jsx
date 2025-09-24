import { useEffect, useState } from "react";
import MessageCard from "../components/MessageCard";
import Sidebar from "../components/Sidebar";
import WriteComment from "../components/WriteComment";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useData } from '../context/DataContext.jsx';
import { postAnnouncement } from "../services/postAnnouncements.services.js";
import { deleteAnnouncement } from "../services/deleteAnnouncement.services.js";

function AllAnnouncement() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [lastSeen, setLastSeen] = useState(null);
  const [hasNew, setHasNew] = useState(false);
  const { announcements = [], user: loggedInUserDetails = {} } = useData();

  useEffect(() => {
    // Get last seen timestamp from localStorage
    const lastSeenTime = localStorage.getItem("announcements_last_seen");
    setLastSeen(lastSeenTime ? new Date(lastSeenTime) : null);
    // Set new last seen timestamp
    localStorage.setItem("announcements_last_seen", new Date().toISOString());
  }, []);

  useEffect(() => {
    // Re-check for new announcements when announcements or lastSeen changes
    const newOnes = (announcements || []).some(
      (obj) => lastSeen && obj.createdAt && new Date(obj.createdAt) > lastSeen
    );
    setHasNew(newOnes);
  }, [announcements, lastSeen]);

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center px-2 pb-32 mt-5">
        {/* Sticky glassy header */}
        <div className="sticky top-0 z-20 w-full max-w-3xl mx-auto flex items-center justify-between px-6 py-4 rounded-b-2xl bg-white/70 backdrop-blur shadow-lg border-b border-blue-200 mb-8 mt-12">
          <div className="text-3xl font-extrabold text-blue-900 tracking-tight">Announcements</div>
          <div className="relative">
            <FiBell className="text-2xl text-blue-700" />
            {hasNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white" title="New announcement"></span>}
          </div>
        </div>
        {/* Announcements grid */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {announcements.length === 0 ? (
            <div className="col-span-full text-gray-500 text-lg mt-8">No announcements found.</div>
          ) : (
            announcements.map((obj) => {
              obj.isResultsAnnouncement = 1;
              const handleClick = () => {
                navigate(`/singleannouncement/${obj?._id}`);
              };
              // Notification logic: show if createdAt > lastSeen
              const isNew = lastSeen && obj.createdAt && new Date(obj.createdAt) > lastSeen;
              return (
                <MessageCard obj={obj} className="w-full relative" key={obj?._id}>
                  {isNew && (
                    <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-lg" title="New announcement"></span>
                  )}
                  <div className="flex flex-row mt-2">
                    <button className="mt-2 mr-2" onClick={handleClick}>
                      <BiSolidCommentDetail color="#64748b" size={22} />
                    </button>
                    {loggedInUserDetails?._id === obj?.writer?._id && (
                      <>
                        <button className="mt-2 ml-2" onClick={(e) => { e.preventDefault(); navigate(`/editAnnouncement/${obj?._id}`); }}>
                          <RiEdit2Fill color="#059669" size={22} />
                        </button>
                        <button className="mt-2 ml-2" onClick={(e) => {
                          e.preventDefault();
                          deleteAnnouncement(obj?._id);
                        }}>
                          <MdDelete color="#ef4444" size={22} />
                        </button>
                      </>
                    )}
                  </div>
                </MessageCard>
              );
            })
          )}
        </div>
        {/* Floating glassy admin input */}
        {loggedInUserDetails?.isAdmin && (
          <div className="fixed bottom-0 left-0 w-full flex justify-center z-30 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl px-4 pb-4">
              <div className="rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-blue-200 p-4">
                <WriteComment
                  value={value}
                  setValue={setValue}
                  className="w-full"
                  handleClick={(e) => {
                    postAnnouncement(e, setValue, value);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}

export default AllAnnouncement;

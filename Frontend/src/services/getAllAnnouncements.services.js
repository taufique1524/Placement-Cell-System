import axios from "axios";
import { baseUrl } from "../constants.js";

const getAllAnnouncements = async () => {

    try {
      // console.log("localStorage.getItem('token')");
      // console.log(localStorage.getItem("token"));
      // this is not a result so is result must be false in the string params
      const response = await axios.get(
        `${baseUrl}/api/announcements/getallannouncements/${false}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (response?.status === 200) {
        // console.log(response?.data);
        // setAllAnnouncements(response.data);
        return response?.data;
      } else {
        // navigate("/error");
        return {};
      }
    } catch (error) {
      console.log(error);
      throw new Error(error)

    //   navigate("/error");
    }
  };

  export {getAllAnnouncements}
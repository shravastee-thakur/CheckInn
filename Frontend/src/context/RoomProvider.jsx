import { createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const createRoom = async (formdata) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rooms/createRoom`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create room", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/hotels/getHotelRooms/${hotelId}/rooms`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        return res.data.rooms;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRoomById = async (roomId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/rooms/getRoomById/${roomId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        return res.data.room;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRoom = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rooms/deleteRoom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete room", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  return (
    <RoomContext.Provider
      value={{ createRoom, fetchRooms, getRoomById, deleteRoom }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;

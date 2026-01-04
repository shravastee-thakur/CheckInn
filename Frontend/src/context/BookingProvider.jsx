import { createContext, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const createBooking = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/createBooking`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create booking", {
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
    <BookingContext.Provider value={{ createBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;

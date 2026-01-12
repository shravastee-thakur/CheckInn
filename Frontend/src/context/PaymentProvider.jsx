import { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const stripePayment = async (bookingId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/payment`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        const checkoutUrl = res.data.url;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to pay", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
    }
  };

  const verifyPayment = async (sessionId, courseId, token) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/verifyPayment`,
        { sessionId, courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      toast.error("Failed to pay", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return false;
    }
  };

  return (
    <>
      <PaymentContext.Provider value={{ stripePayment, verifyPayment }}>
        {children}
      </PaymentContext.Provider>
    </>
  );
};

export default PaymentProvider;

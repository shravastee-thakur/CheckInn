import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [verified, setVerified] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const refreshTokenHandler = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/v1/user/refreshHandler",
          {},
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          setVerified(res.data.user.verified);
          setUserId(res.data.user.id);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Do nothing, user not logged in
        } else {
          console.error("Error during refresh token check:", error);
        }
      }
    };

    refreshTokenHandler();
  }, []);

  const loginStepOne = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/loginStepOne",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#C5FF95",
            color: "#333",
          },
        });
        setUserId(res.data.userId);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyLoginOtp = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/verifyLogin",
        { userId, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#C5FF95",
            color: "#333",
          },
        });
        setVerified(res.data.user.verified);
        setAccessToken(res.data.accessToken);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setUserId(null);
        setAccessToken(null);
        setVerified(false);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          loginStepOne,
          verifyLoginOtp,
          verified,
          logout,
          userId,
          accessToken,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;

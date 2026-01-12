import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthProvider";
import { PaymentContext } from "../../context/PaymentProvider";

const MyBooking = () => {
  const [myBooking, setMyBooking] = useState([]);
  const { accessToken, verified, authLoading } = useContext(AuthContext);
  const { stripePayment } = useContext(PaymentContext);

  useEffect(() => {
    if (authLoading) return;

    if (!accessToken) {
      console.log("No access token yet, skipping fetch");
      return;
    }
    const getMyBooking = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/getMyBookings`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        console.log(res.data);

        if (res.data.success) {
          setMyBooking(res.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch my bookings", error);
      }
    };

    getMyBooking();
  }, [accessToken, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleCancel = async (bookingId) => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/bookings/cancelBooking/${bookingId}`,
        {},
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
        setMyBooking((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel booking", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
    }
  };

  const handlePay = async (bookingId) => {
    const success = await stripePayment(bookingId);
  };

  return (
    <>
      {verified ? (
        <div className="admin-container flex flex-col items-center justify-center px-2 py-4 mt-10">
          <div className=" w-full max-w-full md:max-w-[85%] lg:max-w-[90%] overflow-x-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
              My Bookings
            </h2>

            <TableContainer
              component={Paper}
              sx={{
                overflowX: "auto",
                maxWidth: "100%",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "4px",
                },
              }}
            >
              <Table sx={{ minWidth: "900px" }} aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-[#E7F0DC] ">
                    <TableCell align="center">Hotel</TableCell>
                    <TableCell align="center">Destination</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">Start Date</TableCell>
                    <TableCell align="center">End Date</TableCell>
                    <TableCell align="center">Total Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                    <TableCell align="center">Pay</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myBooking.map((booking) => (
                    <TableRow
                      key={booking._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">
                        {booking.hotelId.name}
                      </TableCell>
                      <TableCell align="center">
                        {booking.hotelId.city}
                      </TableCell>
                      <TableCell align="center">
                        {booking.roomId.type}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(booking.startDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(booking.endDate).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell align="center">
                        {booking.totalAmount}
                      </TableCell>
                      <TableCell align="center">{booking.status}</TableCell>
                      <TableCell align="center">
                        <button
                          disabled={
                            booking.status === "cancelled" ||
                            booking.status === "confirmed"
                          }
                          className={`px-3 py-1 rounded text-white ${
                            booking.status === "cancelled" ||
                            booking.status === "confirmed"
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 cursor-pointer"
                          }`}
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                      </TableCell>
                      <TableCell align="center">
                        <button
                          disabled={
                            booking.status === "confirmed" ||
                            booking.status === "cancelled"
                          }
                          onClick={() => handlePay(booking._id)}
                          className={`px-3 py-1 rounded text-white ${
                            booking.status === "cancelled" ||
                            booking.status === "confirmed"
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-green-600"
                          }`}
                        >
                          Pay
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <h2 className="font-semibold">Please login to check bookings</h2>
        </div>
      )}
    </>
  );
};

export default MyBooking;

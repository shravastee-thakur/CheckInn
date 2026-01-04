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

const MyBooking = () => {
  const [myBooking, setMyBooking] = useState([]);
  const { accessToken, verified, authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (authLoading) return;

    if (!accessToken) {
      console.log("No access token yet, skipping fetch");
      return;
    }
    const getMyBooking = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/getAllBookings`,
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

  const handleDelete = async (bookingId) => {
    console.log(accessToken);

    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/bookings/deleteBooking/${bookingId}`,
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
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
    }
  };

  return (
    <>
      {verified ? (
        <div className="admin-container flex flex-col items-center justify-center px-2 py-4 mt-10">
          <div className=" w-full max-w-full md:max-w-[85%] lg:max-w-[90%] overflow-x-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
              All Bookings
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
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Hotel</TableCell>
                    <TableCell align="center">Destination</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">Start Date</TableCell>
                    <TableCell align="center">End Date</TableCell>
                    <TableCell align="center">Total Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myBooking.map((booking) => (
                    <TableRow
                      key={booking._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">
                        {booking.userId.email}
                      </TableCell>
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
                          className="bg-red-500 px-3 py-1 rounded text-white"
                          onClick={() => handleDelete(booking._id)}
                        >
                          Delete
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

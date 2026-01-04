import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import { RoomContext } from "../../context/RoomProvider";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { verified, accessToken } = useContext(AuthContext);
  const { getRoomById } = useContext(RoomContext);

  // Extract initial dates from URL search params (if user came from hotel page)
  const searchParams = new URLSearchParams(location.search);
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = parseInt(searchParams.get("guests")) || "";

  // State
  const [room, setRoom] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dates, setDates] = useState({
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
  });
  const [guests, setGuests] = useState(initialGuests);
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const nights = Math.ceil(
    (new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24)
  );
  const totalAmount =
    dates.checkIn && dates.checkOut && !isNaN(nights) && nights > 0
      ? nights * room.price
      : null;

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
      } catch (err) {
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!dates.checkIn || !dates.checkOut) {
      setIsAvailable(null);
      return;
    }

    const checkAvail = async () => {
      setCheckingAvailability(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/bookings/checkRoomAvailability/${roomId}`,
          {
            params: { startDate: dates.checkIn, endDate: dates.checkOut },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setIsAvailable(res.data.data.isAvailable);
      } catch (err) {
        setIsAvailable(false);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeout = setTimeout(checkAvail, 500);

    return () => clearTimeout(timeout);
  }, [dates, roomId]);

  const handleBook = async () => {
    if (!verified) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    if (!isAvailable) {
      alert("This room is not available for the selected dates.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookings/createBooking`,
        {
          roomId,
          hotelId: room.hotelId,
          startDate: dates.checkIn,
          endDate: dates.checkOut,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        setDates({ checkIn: "", checkOut: "" });
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/my-bookings");
      }
    } catch (err) {
      toast.error("Failed to book", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Room Image */}
        <div className="h-64 md:h-96 overflow-hidden">
          <img
            src={room.image?.url || "/placeholder-room.jpg"}
            alt={room.type}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">{room.type}</h1>
          <p className="text-gray-600 mt-2 line-clamp-3">{room.description}</p>

          <div className="flex items-center mt-4 text-sm text-gray-500">
            <span>Max {room.maxPeople} guests</span>
            <span className="mx-2">•</span>
            <span>₹ {room.price} / night</span>
          </div>
          {totalAmount && (
            <div className="pt-2 text-blue-800">
              <span className="mr-2">Total Amount:</span>
              <span className="font-bold">
                ₹ {totalAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Booking Form */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Select your stay :
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-in
                </label>
                <input
                  type="date"
                  value={dates.checkIn}
                  min={today}
                  onChange={(e) =>
                    setDates({ ...dates, checkIn: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-out
                </label>
                <input
                  type="date"
                  value={dates.checkOut}
                  min={dates.checkIn || today}
                  onChange={(e) =>
                    setDates({ ...dates, checkOut: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Guests</option>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability & Action */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {checkingAvailability ? (
                <div className="text-sm text-gray-500">
                  Checking availability...
                </div>
              ) : isAvailable === true ? (
                <div className="text-sm text-green-600 font-medium">
                  <CheckCircleIcon /> Available
                </div>
              ) : isAvailable === false ? (
                <div className="text-sm text-red-600 font-medium">
                  <CloseIcon /> Not available
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select dates to check availability
                </div>
              )}

              {verified ? (
                <button
                  onClick={handleBook}
                  disabled={!isAvailable || bookingLoading}
                  className={`px-6 py-2 rounded-md font-medium text-white transition ${
                    isAvailable && !bookingLoading
                      ? "bg-[#2f7003] hover:bg-[#255a02]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-[#2f7003] text-white rounded-md font-medium hover:bg-[#255a02] transition"
                >
                  Sign In to Book
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

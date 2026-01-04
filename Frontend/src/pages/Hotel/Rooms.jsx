import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomContext } from "../../context/RoomProvider";

const Rooms = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const { fetchRooms } = useContext(RoomContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await fetchRooms(hotelId);
        setRooms(roomsData);
      } catch (err) {
        setError("Failed to load rooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      loadRooms();
    }
  }, [hotelId, fetchRooms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading rooms...</div>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const handleRoomClick = (roomId) => {
    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (checkIn || checkOut) params.set("guests", guests);

    const queryString = params.toString();

    navigate(
      queryString
        ? `/room-detail/${roomId}?${queryString}`
        : `/room-detail/${roomId}`
    );
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 text-lg">No rooms available</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => handleRoomClick(room._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <img
              src={room.image?.url}
              alt={room.type}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{room.type}</h3>
              <p className="text-sm text-blue-600 font-semibold mt-1">
                ₹{room.price} / night
              </p>
              <p className="text-sm text-gray-500">
                Max: {room.maxPeople} people
              </p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {room.description}
              </p>

              {/* Optional: Add booking button */}
              <button
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Handle booking logic here
                  console.log("Booking room:", room._id);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;

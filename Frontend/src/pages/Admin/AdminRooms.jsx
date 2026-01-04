import { useState, useContext, useEffect } from "react";
import { RoomContext } from "../../context/RoomProvider";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const AdminRooms = () => {
  const { createRoom, fetchRooms, deleteRoom } = useContext(RoomContext);
  const { accessToken } = useContext(AuthContext);
  const { hotelId } = useParams();

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    price: "",
    maxPeople: "",
  });
  const [image, setImage] = useState([]);

  // Open modal for CREATE
  const openCreateModal = () => {
    setCurrentRoom(null);
    setFormData({
      type: "",
      description: "",
      price: "",
      maxPeople: "",
    });
    setImage(null);
    setIsModalOpen(true);
  };

  // Open modal for EDIT
  const openEditModal = (room) => {
    setCurrentRoom(room);
    setFormData({
      type: room.type,
      description: room.description,
      price: room.price.toString(),
      maxPeople: room.maxPeople.toString(),
    });
    setImage(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const loadRooms = async () => {
      const Rooms = await fetchRooms(hotelId);
      setRooms(Rooms);
    };

    loadRooms();
  }, [hotelId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        alert("Please upload an image file.");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Save (create or update)
  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("hotelId", hotelId);
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("maxPeople", formData.maxPeople);

    if (image) {
      data.append("image", image);
    } else if (!currentRoom) {
      alert("Please upload an image.");
      return;
    }

    try {
      if (currentRoom) {
        console.log("currentRoom", currentRoom._id);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/rooms/updateRoom/${
            currentRoom._id
          }`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Room updated successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        await createRoom(data);
      }

      const updatedRooms = await fetchRooms(hotelId);
      setRooms(updatedRooms);

      setFormData({
        type: "",
        description: "",
        price: "",
        maxPeople: "",
      });
      setImage(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        currentHotel ? "Failed to update room" : "Failed to create room",
        {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        }
      );
    }
  };

  // Delete room
  const handleDelete = async (id) => {
    const success = await deleteRoom(id);
    if (success) {
      setRooms((prev) => prev.filter((r) => r._id !== id));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <KeyboardBackspaceIcon className="text-blue-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
        <button
          onClick={openCreateModal}
          className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl hover:bg-blue-700 shadow-md"
        >
          +
        </button>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <img
              src={room.image.url}
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
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(room)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {currentRoom ? "Edit Room" : "Add New Room"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    name="type"
                    placeholder="Room Type (e.g., Deluxe Suite)"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <textarea
                    name="description"
                    placeholder="Room Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    required
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder="Price per Night (₹)"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    required
                  />

                  <input
                    type="number"
                    name="maxPeople"
                    placeholder="Max Occupancy (e.g., 2, 4)"
                    value={formData.maxPeople}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="1"
                    required
                  />

                  {/* Single Image Dropzone - No Preview */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    <p className="text-gray-600">
                      {image
                        ? `Selected: ${image.name}`
                        : "Drag & drop an image here, or click to upload (single image only)"}
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;

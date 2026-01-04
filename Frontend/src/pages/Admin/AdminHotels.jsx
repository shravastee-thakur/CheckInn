import { useState, useContext, useEffect } from "react";
import { HotelContext } from "../../context/HotelProvider";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminHotels = () => {
  const navigate = useNavigate();
  const { createHotel, fetchHotels, deleteHotel } = useContext(HotelContext);
  const { accessToken } = useContext(AuthContext);

  const [hotels, setHotels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    distance: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  // Open modal for CREATE
  const openCreateModal = () => {
    setCurrentHotel(null);
    setFormData({
      name: "",
      city: "",
      address: "",
      distance: "",
      description: "",
    });
    setImage(null);
    setIsModalOpen(true);
  };

  // Open modal for EDIT
  const openEditModal = (hotel) => {
    setCurrentHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      distance: hotel.distance,
      description: hotel.description,
    });
    setImage(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const loadHotels = async () => {
      const hotelData = await fetchHotels();
      setHotels(hotelData);
    };

    loadHotels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection via input
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle drag and drop
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

  // Save hotel
  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("distance", formData.distance);
    data.append("description", formData.description);

    if (image) {
      data.append("image", image);
    } else if (!currentHotel) {
      alert("Please upload an image.");
      return;
    }

    try {
      if (currentHotel) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/hotels/updateHotel/${
            currentHotel._id
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
        toast.success("Hotel updated successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        await createHotel(data);
      }

      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);

      setFormData({
        name: "",
        city: "",
        address: "",
        distance: "",
        description: "",
      });
      setImage(null);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        currentHotel ? "Failed to update hotel" : "Failed to create hotel",
        {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        }
      );
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteHotel(id);
    if (success) {
      setHotels((prev) => prev.filter((h) => h._id !== id));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Hotels</h1>
        <button
          onClick={openCreateModal}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl hover:bg-blue-700 shadow-md"
        >
          +
        </button>
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <img
              src={hotel.image?.url}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{hotel.name}</h3>
              <p className="text-sm font-semibold text-green-700">
                {hotel.city}
              </p>
              <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(hotel)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
                {/* Add Manage Rooms Button */}
                <button
                  onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms`)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Manage Rooms
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
                {currentHotel ? "Edit Hotel" : "Add New Hotel"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Hotel Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="distance"
                  placeholder="Distance (e.g., 2.5 km from center)"
                  value={formData.distance}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                />

                {/* Single Image Dropzone - No Preview */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-input").click()}
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
                    onChange={handleFileInputChange}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Hotel
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

export default AdminHotels;

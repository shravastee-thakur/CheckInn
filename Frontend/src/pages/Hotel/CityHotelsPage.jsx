import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HotelContext } from "../../context/HotelProvider";

const CityHotelsPage = () => {
  const navigate = useNavigate();
  const { fetchHotels } = useContext(HotelContext);
  const { city: citySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);

  const CITY_MAPPING = {
    Mumbai: "Mumbai",
    Delhi: "Delhi",
    Hyderabad: "Hyderabad",
    Bangalore: "Bangalore",
  };

  useEffect(() => {
    const loadAndFilterHotels = async () => {
      setLoading(true);
      try {
        const hotelData = await fetchHotels();
        setHotels(hotelData);

        const actualCityName = CITY_MAPPING[citySlug] || citySlug;
        const filtered = hotelData.filter((h) => h.city === actualCityName);
        setHotels(filtered);

        setError(null);
      } catch (err) {
        setError("Failed to load hotels. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (citySlug) {
      loadAndFilterHotels();
    }
  }, [citySlug]);

  const cityNames = {
    mumbai: "Mumbai",
    delhi: "Delhi",
    hyderabad: "Hyderabad",
    bangalore: "Bangalore",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading hotels...</div>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const handleHotelClick = (hotelId) => {
    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (checkIn || checkOut) params.set("guests", guests);

    const queryString = params.toString();

    navigate(
      queryString
        ? `/hotel/${hotelId}/rooms?${queryString}`
        : `/hotel/${hotelId}/rooms`
    );
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hotels in {cityNames[citySlug] || citySlug}
        </h1>
        <p className="text-gray-600 mb-8">
          Found {hotels.length} hotels available for your stay.
        </p>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-500">
            No hotels available in this city yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => handleHotelClick(hotel._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={hotel.image?.url}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityHotelsPage;

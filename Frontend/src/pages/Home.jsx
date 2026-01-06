import { useNavigate } from "react-router-dom";

import { useState } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";

const HomePage = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState("");

  const navigate = useNavigate();

  const features = [
    {
      icon: <ThumbUpOffAltIcon fontSize="large" />,
      title: "High Rating",
      description:
        "We take pride in curating a selection of hotels that consistently receive high ratings and positive reviews.",
    },
    {
      icon: <QueryBuilderOutlinedIcon fontSize="large" />,
      title: "Quiet Hours",
      description:
        "We understand that peace and uninterrupted rest are essential for a rejuvenating experience.",
    },
    {
      icon: <LocationOnOutlinedIcon fontSize="large" />,
      title: "Best Location",
      description:
        "At our hotel booking website, we take pride in offering accommodations in the most prime and sought-after locations.",
    },
    {
      icon: <CancelOutlinedIcon fontSize="large" />,
      title: "Free Cancellation",
      description:
        "We understand that travel plans can change unexpectedly, which is why we offer the flexibility of free cancellation.",
    },
    {
      icon: <CreditScoreOutlinedIcon fontSize="large" />,
      title: "Payment Options",
      description:
        "Our hotel booking website offers a range of convenient payment options to suit your preferences.",
    },
    {
      icon: <DiscountOutlinedIcon fontSize="large" />,
      title: "Special Offers",
      description:
        "Whether you're planning a romantic getaway, or a business trip, our carefully curated special offers cater to all your needs.",
    },
  ];

  const destinations = [
    { name: "Mumbai", image: "/Mumbai.jpg", slug: "Mumbai" },
    { name: "Delhi", image: "/Delhi.jpg", slug: "Delhi" },
    { name: "Hyderabad", image: "/Hyderabad.jpg", slug: "Hyderabad" },
    { name: "Bangalore", image: "/Bangalore.jpg", slug: "Bangalore" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination) {
      alert("Please select a destination");
      return;
    }

    const queryParams = new URLSearchParams({
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests: guests.toString(),
    }).toString();

    navigate(`/cities/${destination}?${queryParams}`);
    window.scrollTo(0, 0);
  };

  const handleFeaturedDestination = (citySlug) => {
    navigate(`/cities/${citySlug}`);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/Hotel2.jpg"
          alt="Luxury Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-white text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Check<span className="text-yellow-400">Inn</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Smart. Simple. Secure hotel bookings.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {(() => {
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 30);
            const todayStr = today.toISOString().split("T")[0];
            const maxDateStr = maxDate.toISOString().split("T")[0];

            return (
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"
              >
                {/* Destination */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2f7003]"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check-in */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={dates.checkIn}
                    onChange={(e) =>
                      setDates({ ...dates, checkIn: e.target.value })
                    }
                    min={todayStr}
                    max={maxDateStr}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2f7003]"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={dates.checkOut}
                    onChange={(e) =>
                      setDates({ ...dates, checkOut: e.target.value })
                    }
                    min={dates.checkIn || todayStr}
                    max={maxDateStr}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2f7003]"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Guests
                  </label>

                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2f7003]"
                  >
                    <option value="">Guests</option>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex items-end mb-1">
                  <button
                    type="submit"
                    className="w-full bg-[#41A67E] hover:bg-[#2f8965] text-white font-medium py-2 rounded transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            );
          })()}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Featured Destinations
          </h2>
        </div>

        <section className="px-10 sm:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((city) => (
            <div
              key={city.slug}
              onClick={() => handleFeaturedDestination(city.slug)}
              className="h-[300px] w-full overflow-hidden relative rounded-lg shadow-md group transition-transform duration-300 hover:scale-105"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay: City Name + Explore Button */}
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-50 transition-opacity flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {city.name}
                </h3>
                <button className="inline-flex items-center px-4 py-2 text-yellow-400 font-semibold rounded-md shadow-sm hover:text-white hover:bg-[#41A67E] transition-colors">
                  Explore Hotels →
                </button>
              </div>
            </div>
          ))}
        </section>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Core Features
            </h2>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#e2f3c6] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-[#bda705] mb-3">
                  {feature.icon}
                </h2>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

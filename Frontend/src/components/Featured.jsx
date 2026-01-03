import React, { useState } from "react";

const Featured = () => {
  const [destination, setDestination] = useState("");
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
  };
  const handleFeaturedDestination = (citySlug) => {
    navigate(`/cities/${citySlug}`);
    window.scrollTo(0, 0);
  };


  return (
    <>
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
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {city.name}
                </h3>
                <button className="inline-flex items-center px-4 py-2 text-yellow-400 font-semibold rounded-md shadow-sm hover:text-white hover:bg-[#e27209] transition-colors">
                  Explore Hotels →
                </button>
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default Featured;

import React from "react";

const Featured = () => {
  const cities = [
    { name: "Mumbai", image: "/Mumbai.jpg" },
    { name: "Delhi", image: "/Delhi.jpg" },
    { name: "Hyderabad", image: "/Hyderabad.jpg" },
    { name: "Bangalore", image: "/Bangalore.jpg" },
  ];

  return (
    <>
      <div className="text-center py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Featured Destinations
        </h2>
      </div>

      <section className="mt-[20px] px-10 sm:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cities.map((city) => (
          <div
            key={city.name}
            className="h-[300px] w-full overflow-hidden relative rounded-lg shadow-md"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white py-1 px-3 rounded">
              <h2 className="font-semibold text-lg">{city.name}</h2>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Featured;

import { useState, useEffect, useContext } from "react";
// import { BookingContext } from "../context/BookingProvider";

const Book = () => {
  //   const { bookingInfo, setBookingInfo } = useContext(BookingContext);

  //   const [startDate, setStartDate] = useState(bookingInfo.startDate || "");
  //   const [endDate, setEndDate] = useState(bookingInfo.endDate || "");
  //   const [pickup, setPickup] = useState(bookingInfo.pickupLocation || "");
  //   const [drop, setDrop] = useState(bookingInfo.dropLocation || "");
  //   const [days, setDays] = useState(bookingInfo.totalDays || "");

  //   useEffect(() => {
  //     const calculatedDays =
  //       startDate && endDate
  //         ? Math.ceil(
  //             (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  //           ) + 1
  //         : "";

  //     setDays(calculatedDays);
  //     setBookingInfo({
  //       startDate,
  //       endDate,
  //       pickupLocation: pickup,
  //       dropLocation: drop,
  //       totalDays: days,
  //     });
  //   }, [startDate, endDate, pickup, drop, days]);

  return (
    <section className="bg-[#0952b7] py-14">
      <div className="bg-[#adc9ee] px-10 py-6 h-auto w-10/12 mx-auto rounded-lg border-2 border-white lg:w-11/12 lg:rounded-lg lg:border-[3px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {/* Select Place Dropdown */}
          <div className="flex flex-col">
            <label className="md:text-lg">Select Place</label>
            <select
              required
              className="bg-white border focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent py-1 px-1 md:py-2 md:px-4 rounded-lg"
              // onChange={(e) => setPickup(e.target.value)}
            >
              <option value="">Select a city</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="md:text-lg">Start Date</label>
            <input
              required
              className="bg-white border focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent py-1 px-1 md:py-2 md:px-4 rounded-lg"
              type="date"
              // onChange={(e) => setStartDate(e.target.value)}
              // min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="md:text-lg">End Date</label>
            <input
              required
              className="bg-white border focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent py-1 px-1 md:py-2 md:px-4 rounded-lg"
              type="date"
              // onChange={(e) => setEndDate(e.target.value)}
              // min={startDate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Book;

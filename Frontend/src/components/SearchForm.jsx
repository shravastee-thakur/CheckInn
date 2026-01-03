import { useEffect, useRef, useState } from "react";

const CustomDropdown = ({ options, label, onSelect, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col" ref={dropdownRef}>
      <label className="md:text-lg">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border text-left focus:outline-none focus:ring-2 focus:ring-[#67B2D8] rounded-lg py-1 px-1 md:py-2 md:px-4 ${
            required && !selected ? "border-red-500" : "border-gray-300"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selected || "Select a city"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul
            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none"
            role="listbox"
          >
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-[#67B2D8] hover:text-white cursor-pointer"
                role="option"
                aria-selected={selected === option}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Main Section Component
const SearchForm = () => {
  const [pickup, setPickup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const cities = ["Mumbai", "Delhi", "Hyderabad", "Bangalore"];

  return (
    <section className="bg-[#0952b7] py-14">
      <div className="bg-[#adc9ee] px-10 py-6 w-10/12 mx-auto rounded-lg border-2 border-white lg:w-11/12">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {/* Custom Dropdown */}
          <CustomDropdown
            label="Select Place"
            options={cities}
            onSelect={setPickup}
            required
          />

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="md:text-lg">Start Date</label>
            <input
              required
              className="bg-white border focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent py-1 px-1 md:py-2 md:px-4 rounded-lg"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="md:text-lg">End Date</label>
            <input
              required
              className="bg-white border focus:outline-none focus:ring-2 focus:ring-[#67B2D8] focus:border-transparent py-1 px-1 md:py-2 md:px-4 rounded-lg"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchForm;

import { useNavigate } from "react-router-dom";

const CarRental = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    window.open(
      "https://shra-driveaway.netlify.app/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          External Redirect
        </h1>

        <p className="text-gray-600 mb-8">
          You are about to leave{" "}
          <span className="font-semibold text-[#05339C]">StayEase</span> and be
          redirected to a third-party car rental service.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="px-5 py-2.5 rounded-lg bg-[#05339C] text-white font-medium hover:bg-[#042a7a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#05339C]"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRental;

import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClearIcon />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again
          or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 py-3 px-4 bg-[#2f7003] hover:bg-[#255a02] text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f7003]"
          >
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

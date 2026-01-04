import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br bg-yellow-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-5">
          <SentimentDissatisfiedOutlinedIcon
            sx={{ fontSize: 140 }}
            className="mx-auto text-orange-400"
          />
        </div>

        <h1 className="text-6xl font-extrabold text-orange-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or may have been
          moved.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

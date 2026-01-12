import { useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { PaymentContext } from "../../context/PaymentProvider";
import { AuthContext } from "../../context/AuthProvider";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingId } = useParams();
  const { verifyPayment } = useContext(PaymentContext);
  const { accessToken } = useContext(AuthContext);

  const sessionId = searchParams.get("session_id");

  const called = useRef(false);

  useEffect(() => {
    if (sessionId && bookingId && accessToken && !called.current) {
      called.current = true;

      const runVerification = async () => {
        const success = await verifyPayment(sessionId, bookingId, accessToken);
        if (success) {
          setTimeout(() => navigate("/my-bookings"), 5000);
        }
      };

      runVerification();
    }
  }, [sessionId, bookingId, verifyPayment, navigate, accessToken]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>Please wait while we process your booking...</p>
      <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;

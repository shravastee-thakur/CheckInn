import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import HotelProvider from "./context/HotelProvider.jsx";
import RoomProvider from "./context/RoomProvider.jsx";
import BookingProvider from "./context/BookingProvider.jsx";
import PaymentProvider from "./context/PaymentProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HotelProvider>
      <RoomProvider>
        <BookingProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </BookingProvider>
      </RoomProvider>
    </HotelProvider>
  </AuthProvider>
);

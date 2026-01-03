import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import { Toaster } from "react-hot-toast";
import Forgetpassword from "./pages/User/Forgetpassword";
import ResetPassword from "./pages/User/ResetPassword";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import VerifyLogin from "./pages/User/VerifyLogin";

const App = () => {
  return (
    <div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;

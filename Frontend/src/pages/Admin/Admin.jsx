import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="rounded-lg shadow-sm p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

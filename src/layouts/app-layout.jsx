import Header from "../components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="grid-background"></div>
      <main className="min-h-screen container pt-24">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        ALL RIGHTS RESERVED &copy; - HireMe 2025
      </div>
    </div>
  );
};

export default AppLayout;

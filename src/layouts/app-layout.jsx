import Header from "../components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div style={{ background: 'blue', color: 'white', padding: '20px' }}>
      
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        ALL RIGHTS RESERVED - 2025  
      </div>
    </div>
  );
};

export default AppLayout;
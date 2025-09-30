import Header from "../components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="grid-background"></div>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/20 py-8 text-center text-sm text-muted-foreground">
        ALL RIGHTS RESERVED &copy; - HireMe 2025
      </footer>
    </div>
  );
};

export default AppLayout;

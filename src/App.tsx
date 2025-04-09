import "./index.css";
import { Layout } from "@/Layout";
import { useEffect, useState } from "react";
import Dashboard from "./pages/";
import ClientsPage from "./pages/clients";
import PaymentsPage from "./pages/payments";
import AttendancePage from "./pages/attendance";
import FacilitatorsPage from "./pages/facilitators";
import ReportsPage from "./pages/reports";
import SettingsPage from "./pages/settings";
import ClientDetail from "./pages/clients/[id]";
import { FC } from "react";

// Define a common navigation props interface
export interface NavigationProps {
  navigate: (path: string) => void;
}

// Simple route mapping for demonstration
const routes: Record<string, FC<NavigationProps>> = {
  "/": Dashboard,
  "/clients": ClientsPage,
  "/clients/1": ClientDetail, // Example client detail page
  "/payments": PaymentsPage,
  "/attendance": AttendancePage,
  "/facilitators": FacilitatorsPage,
  "/reports": ReportsPage,
  "/settings": SettingsPage,
};

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle navigation and update the path
  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for navigation events
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  // Custom navigate function to handle client-side navigation
  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // In a real app, you'd use a proper router that handles dynamic paths better
  const PageComponent: FC<NavigationProps> = routes[currentPath as keyof typeof routes] || Dashboard;

  return (
    <Layout>
      <PageComponent navigate={navigate} />
    </Layout>
  );
}

export default App;

/**
 * App.tsx
 *
 * App layout & global wrappers:
 *  - Renders Navbar, Footer, and a <main> where child routes are displayed.
 *
 * SRP: This file handles the high-level UI structure.
 * DIP: It depends on abstract child routes (via <Outlet />).
 */

import {
  BackToTopButton,
  Footer,
  LoadingScreen,
  Navbar,
  ScrollToTopConnected,
} from "@/components/common";
import { Outlet, useNavigation } from "react-router-dom";

const App: React.FC = () => {
  const navigation = useNavigation();
  return (
    <div className="min-h-screen flex flex-col relative">
      {navigation.state === "loading" && (
        <div className="absolute inset-0 z-50">
          <LoadingScreen />
        </div>
      )}

      <ScrollToTopConnected />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default App;

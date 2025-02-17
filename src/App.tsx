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

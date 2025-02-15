import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/common/LoadingScreen";
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
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;

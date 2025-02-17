import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import ScrollToTop from "./ScrollToTop";

const ScrollToTopConnected: React.FC = () => {
  const page = useSelector((state: RootState) => state.filters.page);
  return <ScrollToTop page={page} />;
};

export default ScrollToTopConnected;

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useGlobalLoading } from "./store/selectors/useGlobalLoading";
import Loader from "./components/common/Loader";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./socket/socketEvents";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const isLoading = useGlobalLoading();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <BrowserRouter>
      {isLoading && <Loader fullScreen />}
      <AppRoutes />
      <Toaster position="top-center" richColors closeButton={false} />
    </BrowserRouter>
  );
}

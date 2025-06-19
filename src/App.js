import { RouterProvider } from "react-router";
import router from "./routes";
import { Provider } from "./components/ui/provider";
import { Box } from "@chakra-ui/react";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { TechnicianProvider } from "./providers/TechnicianProvider";
import 'leaflet/dist/leaflet.css';
import { ClientProvider } from "./providers/ClientProvider";

function App() {
  return (
    <Provider>
      <Box colorPalette='brand'>
        <AuthProvider>
          <TechnicianProvider>
            <ClientProvider>
              <RouterProvider router={router} />
            </ClientProvider>
          </TechnicianProvider>
        </AuthProvider>
        <Toaster />
      </Box>
    </Provider>
  );
}

export default App;

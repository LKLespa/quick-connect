import { RouterProvider } from "react-router";
import router from "./routes";
import { Provider } from "./components/ui/provider";
import { Box } from "@chakra-ui/react";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { TechnicianProvider } from "./providers/TechnicianProvider";

function App() {
  return (
    <Provider>
      <Box colorPalette='brand'>
        <AuthProvider>
          <TechnicianProvider>
            <RouterProvider router={router} />
          </TechnicianProvider>
        </AuthProvider>
        <Toaster />
      </Box>
    </Provider>
  );
}

export default App;

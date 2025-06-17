import { RouterProvider } from "react-router";
import router from "./routes";
import { Provider } from "./components/ui/provider";
import { Box } from "@chakra-ui/react";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Provider>
      <Box colorPalette='brand'>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <Toaster />
      </Box>
    </Provider>
  );
}

export default App;

import { RouterProvider } from "react-router";
import router from "./routes";
import { Provider } from "./components/ui/provider";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Provider>
      <Box colorPalette='blue'>
        <RouterProvider router={router}/>
      </Box>
    </Provider>
  );
}

export default App;

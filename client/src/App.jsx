import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import theme from "./helpers/Theme";
import { ThemeProvider } from "@mui/material/styles";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import RootLayout from "./layouts/RootLayout";
import Voting from "./components/Voting";
import Result from "./components/Result";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<RootLayout />}>
          <Route path="" element={<Voting />} />
          <Route path="results" element={<Result />} /> {/* Add this new route */}
        </Route>
      </>
    )
  );
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
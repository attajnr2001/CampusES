import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Voters from "./components/Voters"; // Import the Voters component
import Candidates from "./components/Candidates"; // Import the Candidates component
import Settings from "./components/Settings"; // Import the Settings component
import theme from "./helpers/Theme";
import { ThemeProvider } from "@mui/material/styles";
import RootLayout from "./layouts/RootLayout";
import Admin from "./components/Admin";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<RootLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="voters" element={<Voters />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admins" element={<Admin />} />
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

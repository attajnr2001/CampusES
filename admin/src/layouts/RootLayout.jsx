import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Widget from "../components/Widget";
import { Box, Container } from "@mui/material";

const RootLayout = () => {
  return (
    <Box>
      <Navbar />
      <Container sx={{ mt: "5rem" }}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 2,
            padding: 2,
          }}
        >
          <Widget type="voters" />
          <Widget type="candidates" />
        </Box>
        <Outlet />
      </Container>
    </Box>
  );
};

export default RootLayout;

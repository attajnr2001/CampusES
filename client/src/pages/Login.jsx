import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import login from "/voters.jpg";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../helpers/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [indexNumber, setIndexNumber] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const votersCollection = collection(db, "voters");
      const q = query(
        votersCollection,
        where("indexNumber", "==", parseInt(indexNumber)),
        where("applicantId", "==", parseInt(applicantId))
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid credentials. Please try again.");
      }

      let voter = null;
      querySnapshot.forEach((doc) => {
        voter = { id: doc.id, ...doc.data() };
      });

      // if (voter.hasVoted) {
      //   throw new Error("You have already voted.");
      // }

      dispatch({ type: "LOGIN", payload: voter });
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbar({
        open: true,
        message: `Login failed: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3}>
          <Grid
            container
            sx={{ height: "70vh", width: "80vw", maxWidth: "1000px" }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundImage: `url(${login})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={"bold"}>
                Student Login
              </Typography>
              <TextField
                label="Index Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
              />
              <TextField
                label="Applicant ID"
                variant="outlined"
                fullWidth
                margin="normal"
                value={applicantId}
                onChange={(e) => setApplicantId(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                If you're having trouble logging in, please contact the
                administration.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;

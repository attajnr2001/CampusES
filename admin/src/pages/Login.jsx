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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../helpers/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const adminCollection = collection(db, "admins");
      const q = query(adminCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let adminId = null;
      let isAdminActive = true;

      querySnapshot.forEach((doc) => {
        adminId = doc.data().adminId;
        isAdminActive = doc.data().status;
      });

      if (isAdminActive !== "Active") {
        throw new Error("Your credentials are deactivated.");
      }

      dispatch({ type: "LOGIN", payload: user });
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
                backgroundImage: `url(${"https://img.freepik.com/free-vector/voting-concept-illustration_114360-5822.jpg?t=st=1724733151~exp=1724736751~hmac=e359ff6c0453cf942523d0f7f048e4a1633e43a0e93d10db11c4173608204cb3&w=740"})`,
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
                Login
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                sx={{ mt: 2, textAlign: "center" }}
              >
                I don't have an account
              </Link>
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

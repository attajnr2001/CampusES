import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircleOutline,
  Security,
  Update,
  PhoneAndroid,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VoteEase
          </Typography>
          <Button color="inherit" href="#about">
            About
          </Button>
          <Button color="inherit" href="#features">
            Features
          </Button>
          <Button color="inherit" href="#contact">
            Contact
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                fontWeight="bold"
                component="h1"
                gutterBottom
              >
                WELCOME TO EASEVOTE
              </Typography>
              <Typography variant="h5" paragraph>
                Simplifying the voting process for everyone
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/login"
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://img.freepik.com/free-vector/elections-concept-illustration_114360-24247.jpg?t=st=1724736931~exp=1724740531~hmac=806b93befbf5fc809d0f07f4fdf4da853fd1be91c07a11ce4ab2a37a2d654e60&w=740"
                alt="Illustration of people voting"
                sx={{ width: "100%", height: "auto", borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box id="about" sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About VoteEase
          </Typography>
          <Typography variant="body1" paragraph>
            VoteEase is a secure and user-friendly platform designed to
            streamline the voting process for organizations of all sizes.
          </Typography>
        </Box>

        <Box id="features" sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline />
                  </ListItemIcon>
                  <ListItemText primary="Easy-to-use interface" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary="Secure voting process" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Update />
                  </ListItemIcon>
                  <ListItemText primary="Real-time results" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneAndroid />
                  </ListItemIcon>
                  <ListItemText primary="Mobile-friendly design" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box id="contact" sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions? Reach out to us at info@voteease.com
          </Typography>
        </Box>
      </Container>

      <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 VoteEase. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;

import React, { useEffect, useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import SickRoundedIcon from "@mui/icons-material/SickRounded";
import { useNavigate, Link } from "react-router-dom";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Avatar from "@mui/material/Avatar";
import { AuthContext } from "../context/AuthContext";
import PeopleIcon from "@mui/icons-material/People";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const settings = ["Logout"];

function Navbar() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [makeComplainOpen, setMakeComplainOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Replace with your API call or data fetching logic
    if (currentUser) {
      // Simulate fetching customer data
      // Example API call:
      // fetchCustomerData(currentUser.email).then(data => {
      //   setCustomerData(data);
      //   setUserAvatar(data.image || "");
      //   setUserName(data.name || "");
      // });

      // Simulate setting customer data
      setCustomerData({
        id: "12345",
        name: "John Doe",
        image: "",
      });
      setUserName("John Doe");
      setUserAvatar(""); // Set a default avatar or image URL
    }
  }, [currentUser]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenProfile = async () => {
    if (currentUser) {
      // Simulate fetching customer data
      // Example API call:
      // const customerDoc = await fetchCustomerData(currentUser.email);
      // setCustomerData(customerDoc);

      setCustomerData({
        id: "12345",
        name: "John Doe",
        image: "",
      });
    }
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleOpenMakeComplain = () => {
    setMakeComplainOpen(true);
  };

  const handleCloseMakeComplain = () => {
    setMakeComplainOpen(false);
  };

  const handleMenuItemClick = (setting) => {
    if (setting === "Logout") {
      handleLogout();
    } else if (setting === "Profile") {
      handleOpenProfile();
    }
    handleCloseUserMenu();
  };

  const handleOpenNotifications = () => {
    setNotificationsOpen(true);
  };

  const handleCloseNotifications = () => {
    setNotificationsOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    // Simulate sign out
    // Example API call:
    // await signOut();

    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="top">
      <AppBar
        position="fixed"
        sx={{
          alignItems: "center",
          top: showNavbar ? "0" : "-64px",
          transition: "top 0.3s",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/dashboard"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              VOTE
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/dashboard"
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              VOTE
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Voters">
                <IconButton
                  sx={{ p: 0, mr: 2 }}
                  onClick={() => navigate("/dashboard/voters")}
                >
                  <PeopleIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Candidates">
                <IconButton
                  sx={{ p: 0, mr: 2 }}
                  onClick={() => navigate("/dashboard/candidates")}
                >
                  <HowToVoteIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  sx={{ p: 0, mr: 2 }}
                  onClick={() => navigate("/dashboard/settings")}
                >
                  <SettingsIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Admins">
                <IconButton
                  sx={{ p: 0, mr: 2 }}
                  onClick={() => navigate("/dashboard/admins")}
                >
                  <AdminPanelSettingsIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ width: 30, height: 30, p: 0, ml: 1 }}
                >
                  <Avatar
                    alt={userName}
                    src={""}
                    sx={{ width: 30, height: 30, bgcolor: "#6439ff" }}
                  ></Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuItemClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default Navbar;

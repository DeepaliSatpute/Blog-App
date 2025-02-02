import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const buttonStyles = {
    fontSize: "1.1rem",
    fontWeight: "700",
    padding: "0.5rem 1.5rem",
    color: "#fff", // White color for text
    backgroundColor: "#2C3E50", // A cool shade of dark blue for the button
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#34495E", // Darker shade on hover
    },
  };

  return (
    <AppBar style={{ backgroundColor: "black" }}>
      <Toolbar>
        <Typography variant="h4" style={{ flexGrow: 1, color: "#fff" }}>
          MY BLOG
        </Typography>

        {/* For Mobile View (Hamburger Menu) */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          style={{ display: "block", md: "none" }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Menu for mobile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <Link to="/home" style={{ textDecoration: "none" }}>
            <MenuItem onClick={handleCloseMenu}>Home</MenuItem>
          </Link>
        </Menu>

        {/* For Desktop View */}
        <Link to="/home" style={{ textDecoration: "none" }}>
          <Button style={buttonStyles} variant="contained">
            Home
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

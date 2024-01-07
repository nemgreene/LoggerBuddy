import React, { useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MenuIcon from "@mui/icons-material/Menu";

export default function ScrumNav({ streamData, client }) {
  const { _id, accessToken } = useMemo(
    () => client.credentialsProvider(),
    [client]
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => client.redirectHandler("/")}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {streamData.streamName}
          </Typography>
          {accessToken && _id ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                client.logoutHandler();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                client.redirectHandler("/login");
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

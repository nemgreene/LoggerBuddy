import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BioDrawer from "./BioBar";
import TagSelect from "./TagSelect";
import { drawerWidth } from "./Utility";
import StreamSelect from "./StreamSelect";

export default function HomeDrawer({
  client,
  children,
  credentials,
  open,
  activeTags,
  changeActiveTags,
  handleDrawerOpen,
  handleDrawerClose,
  tags,
  streamHeaders,
  changeTrackedStream,
  trackedStream,
}) {
  const theme = useTheme();

  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    })
  );

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open, subheader }) => ({
    backgroundColor: subheader
      ? theme.palette.info.dark
      : theme.palette.grey.dark,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/*  Header*/}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <SettingsAccessibilityIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Development Logger
          </Typography>
          {credentials.accessToken ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                client.logoutHandler();
              }}
            >
              Logout
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <BioDrawer client={client} credentials={credentials} />
      </Drawer>

      <Main open={open}>
        {/* <AppBar
          position="fixed"
          open={open}
          subheader="true"
          sx={{
            mt: "64px",
            bgcolor: theme.palette.primary,
            whiteSpace: "nowrap",
          }}
        >
          <Toolbar sx={{ postion: "absolute", bottom: 0 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, padding: "0px 5%" }}
            >
              Tags:
            </Typography>

            <TagSelect
              options={tags}
              value={activeTags}
              setValue={changeActiveTags}
            />
          </Toolbar>
        </AppBar> */}
        <AppBar
          position="fixed"
          open={open}
          subheader="true"
          sx={{
            bgcolor: theme.palette.primary,
            whiteSpace: "nowrap",
            // maxHeight: "64px",
            top: "auto",
            bottom: 0,
          }}
        >
          <Toolbar>
            <Grid container sx={{ width: "100%" }}>
              <Grid item xs={1}></Grid>
              <Grid
                item
                container
                sx={{
                  hieght: "100%",
                  alignItems: "center",
                  padding: "0px 10px",
                }}
                xs={5}
              >
                <TagSelect
                  options={tags}
                  value={activeTags}
                  setValue={changeActiveTags}
                  label={"Filter posts by tag..."}
                />
              </Grid>
              <Grid
                item
                container
                sx={{
                  hieght: "100%",
                  alignItems: "center",
                  padding: "0px 10px",
                }}
                xs={5}
              >
                <StreamSelect
                  options={streamHeaders}
                  // options={streamHeaders.map((stream) => stream.streamName)}

                  value={trackedStream}
                  setValue={(e) => {
                    changeTrackedStream(e);
                  }}
                  label={"Filter posts by Stream..."}
                ></StreamSelect>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <DrawerHeader />
        {children}
        <DrawerHeader />
        <DrawerHeader />
      </Main>
    </Box>
  );
}

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import HomeDrawer from "./HomeDrawer";
import StreamTable from "./StreamTable";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import { drawerWidth } from "./Utility";

// const DynamicFooter = styled("div", {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => {
//   console.log(theme.palette);
//   return {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     backgroundColor: theme.palette.background.paper,
//     bottom: 0,
//     position: "fixed",
//     zIndex: "1000",
//     minHeight: "128px",
//     marginRight: "5%",
//     ...(open && {
//       width: `calc(100% - ${drawerWidth}px)`,
//       transition: theme.transitions.create(["margin", "width"], {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       // marginLeft: `-${drawerWidth}px `,
//     }),
//   };
// });
// const DynamicFooter = styled("div", {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open, subheader }) => ({
//   backgroundColor: subheader
//     ? theme.palette.info.dark
//     : theme.palette.grey.dark,
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   // backgroundColor: theme.palette.background.paper,
//   backgroundColor: "red",

//   //     bottom: 0,
//   //     position: "fixed",
//   //     zIndex: "1000",
//   //     minHeight: "128px",
//   //     marginRight: "5%",
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

export default function App({
  tags,
  page,
  pages,
  client,
  scrollRef,
  credentials,
  activeTags,
  changeActiveTags,
  displayPosts,
  handleChange,
  streamHeaders,
  trackedStream,
  changeScrollRef,
  changeTrackedStream,
}) {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="LoggerBuddy">
      <HomeDrawer
        tags={tags}
        client={client}
        credentials={credentials}
        open={open}
        activeTags={activeTags}
        changeActiveTags={changeActiveTags}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      >
        <StreamTable
          drawerOpen={open}
          client={client}
          trackedStream={trackedStream}
          changeTrackedStream={changeTrackedStream}
          streamData={displayPosts?.posts}
          streamHeaders={streamHeaders}
          // streamData={displayPosts.posts}
          // streamData={[]}
          changeScrollRef={changeScrollRef}
          scrollRef={scrollRef}
          credentials={credentials}
          tags={tags}
        />
        {/* <DynamicFooter>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
          </BottomNavigation>
        </DynamicFooter> */}
        <Grid container>
          <Grid item xs={12} container justifyContent={"center"}>
            <Grid item>
              <br />
              <Pagination
                variant="outlined"
                shape="rounded"
                showFirstButton={page != 1}
                showLastButton={page != pages}
                page={page}
                size="large"
                onChange={handleChange}
                count={pages}
              />
            </Grid>
          </Grid>
        </Grid>
      </HomeDrawer>
    </div>
  );
}
//

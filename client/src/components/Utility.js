import GitHubIcon from "@mui/icons-material/GitHub";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HomeIcon from "@mui/icons-material/Home";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { createTheme } from "@mui/material/styles";

export const sortObj = {
  dateDesc: {
    // icon: <HistoryIcon />,
    title: "Date",
    tooltip: "Most Recent Watered First",
    exec: (a, b) => {
      return new Date(b.datePosted) - new Date(a.datePosted);
    },
  },
  dateAsc: {
    // icon: <UpdateIcon />,
    title: "Date",
    tooltip: "Least Recent Watered First",
    exec: (a, b) => {
      return new Date(a.datePosted) - new Date(b.datePosted);
    },
  },
};

export const linkIcons = {
  git: <GitHubIcon />,
  artstation: <ColorLensIcon />,
  deploy: <HomeIcon />,
  youtube: <YouTubeIcon />,
};

export let toastrConfig = {
  position: "top-right",
  autoClose: 700,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};
export const pageSize = 5;

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const drawerWidth = window.innerWidth / 4;

export const syncTrackedPosts = (changeTrackedStream, streamOverhead) => {
  changeTrackedStream((p) => {
    let prev = [...p];
    prev = prev.map((trackedStream) => {
      return streamOverhead.filter((so) =>
        JSON.stringify(trackedStream).includes(so.streamId)
      )[0];
    });
    return prev;
  });
};

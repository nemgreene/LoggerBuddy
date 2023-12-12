import GitHubIcon from "@mui/icons-material/GitHub";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HomeIcon from "@mui/icons-material/Home";
import YouTubeIcon from "@mui/icons-material/YouTube";

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

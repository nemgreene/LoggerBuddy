import GitHubIcon from "@mui/icons-material/GitHub";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HomeIcon from "@mui/icons-material/Home";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { createTheme } from "@mui/material/styles";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SubjectIcon from "@mui/icons-material/Subject";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
} from "@mui/material/colors";
import { Box, styled } from "@mui/system";
import { Grid, Skeleton } from "@mui/material";
import { darken } from "@mui/material/styles";

let theme = createTheme({});
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

export const colors = [
  darken(red[900], 0.5),
  darken(pink[900], 0.5),
  darken(purple[900], 0.5),
  darken(deepPurple[900], 0.5),
  darken(indigo[900], 0.5),
  darken(blue[900], 0.5),
  darken(lightBlue[900], 0.5),
  darken(cyan[900], 0.5),
  darken(teal[900], 0.5),
  darken(green[900], 0.5),
  darken(lightGreen[900], 0.5),
  darken(lime[900], 0.5),
  darken(yellow[900], 0.5),
  darken(amber[900], 0.5),
  darken(orange[900], 0.5),
  darken(deepOrange[900], 0.5),
];

export const GridRow = styled(Grid)(({ theme }) => ({
  padding: `${theme.spacing(1)} 0px`,
}));

export const GridCap = (props) => (
  <Grid
    item
    xs={1}
    sx={{
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Grid>
);
export const GridCol = (props) => (
  <Grid
    item
    xs={11}
    sx={{
      pl: (t) => t.spacing(2),
      alignItems: "center",
      display: "flex",
      alignContent: "center",
    }}
  >
    {props.children}
  </Grid>
);

export const ScrumItemIconDict = {
  home: (fontSize) => ({
    title: "Task",
    icon: <AssignmentIcon fontSize={fontSize} />,
  }),
  checklist: (fontSize) => ({
    title: "Checklist",
    icon: <ChecklistIcon fontSize={fontSize} />,
  }),
  attachments: (fontSize) => ({
    title: "Attachments",
    icon: <AttachFileIcon fontSize={fontSize} />,
  }),
  comments: (fontSize) => ({
    title: "Comments",
    icon: <CommentIcon fontSize={fontSize} />,
  }),
  labels: (fontSize) => ({
    title: "Labels",
    icon: <LabelIcon fontSize={fontSize} />,
  }),
  dates: (fontSize) => ({
    title: "Dates",
    icon: <CalendarMonthIcon fontSize={fontSize} />,
  }),
};

export const FormSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      p: (t) =>
        `${t.spacing(2)} ${t.spacing(2)} ${t.spacing(3)} ${t.spacing(2)}`,
    }}
  >
    <Box sx={{ display: "flex" }}>
      <Skeleton sx={{ width: "20%" }}></Skeleton>
      <Box sx={{ width: "10%" }} />
      <Skeleton sx={{ width: "70%" }}></Skeleton>
    </Box>
    <Skeleton></Skeleton>
  </Box>
);

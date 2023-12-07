import React, { useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tooltip } from "@mui/material";
import Pictures from "./Pictures";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  whiteSpace: " pre-line",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
const cardStyles = {
  margin: "10px 0px 10px 0px",
  padding: "5px 15px",
  width: "100%",
};

function ContentCard({
  postObj,
  trackedStream,
  changeTrackedStream,
  changeScrollRef,
}) {
  const [expanded, setExpanded] = useState(false);
  const myRef = useRef(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        ...cardStyles,
        backgroundColor: postObj.displayCard ? postObj.color + "20" : "none",
      }}
      ref={myRef}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ backgroundColor: postObj["color"] ? postObj.color : "" }}
            aria-label="recipe"
          >
            {postObj["streamName"] ? postObj.streamName[0] : ""}
          </Avatar>
        }
        action={
          postObj.displayCard ? (
            false
          ) : !trackedStream ? (
            <Tooltip title="Track This Stream">
              <IconButton
                aria-label="follow_stream"
                onClick={() => {
                  changeTrackedStream(postObj.streamId);
                  changeScrollRef(postObj._id);
                }}
              >
                <AccountTreeIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Untrack Stream">
              <IconButton
                aria-label="all_streams"
                onClick={() => {
                  changeTrackedStream(undefined);
                }}
              >
                <AssignmentReturnIcon />
              </IconButton>
            </Tooltip>
          )
        }
        title={postObj["streamName"] ? postObj.streamName : ""}
        subheader={`${postObj.displayCard ? "Created" : "Posted"}: ${
          postObj["datePosted"]
            ? new Date(postObj.datePosted).toDateString()
            : new Date().toDateString()
        }`}
      />
      {postObj["images"] && postObj["images"][0] ? (
        <Pictures images={postObj.images} />
      ) : null}
      <CardContent>
        <Typography variant="h5" color="text.secondary">
          {postObj.h1}
        </Typography>
        <br />
        <Typography variant="h6" color="text.secondary">
          {postObj.h2}
        </Typography>
        <br />
        <Typography
          style={{ whiteSpace: " pre-line" }}
          variant="body2"
          color="text.secondary"
        >
          {postObj.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {postObj.cut ? (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            style={{ whiteSpace: " pre-line" }}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        ) : null}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            style={{ whiteSpace: " pre-line" }}
            variant="body2"
            color="text.secondary"
          >
            {postObj.cut}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default function PostCard({
  postObj,
  trackedStream,
  changeTrackedStream,
  changeScrollRef,
}) {
  return postObj ? (
    <ContentCard
      postObj={postObj}
      trackedStream={trackedStream}
      changeTrackedStream={changeTrackedStream}
      changeScrollRef={changeScrollRef}
    />
  ) : (
    // skeleton post
    <Card sx={{ ...cardStyles }}>
      <CardContent>
        <Stack spacing={1}>
          <Grid container>
            <Grid item container xs={8} justifyContent={"center"}>
              <Skeleton variant="rectangular" width={"100%"} height={"30vh"} />
            </Grid>
            <Grid item container xs={3} justifyContent={"center"}>
              <Grid item container justifyContent={"center"} xs={12}>
                <Skeleton variant="circular" width={"50%"} height={"90%"} />
              </Grid>
              <Grid item container justifyContent={"center"} xs={12}>
                <Skeleton variant="circular" width={"50%"} height={"90%"} />
              </Grid>
            </Grid>
          </Grid>
          <Skeleton variant="rounded" width={"50%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={200} />
        </Stack>
      </CardContent>
    </Card>
  );
}

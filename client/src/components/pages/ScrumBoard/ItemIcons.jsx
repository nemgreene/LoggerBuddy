import React, { useEffect } from "react";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, Grid, Typography, Chip, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { ScrumItemIconDict } from "../../Utility";

export default function ItemIcons({
  task,
  hoveredComponent,
  openModal,
  display,
  isDragging,
  col,
  client,
}) {
  const CGrid = (props) => (
    <Grid
      item={true}
      xs={1}
      sx={{
        cursor: "pointer",
        alignItems: "center",
        display: "flex",
        alignItems: "center",
        flexWrap: "noWrap",
        width: "fit-content",
        // color: (theme) => "#121212;",
        // opacity: display ? 0 : 1,
      }}
    >
      {props.children}
    </Grid>
  );

  const iconStyle = {
    m: (t) => `0px ${t.spacing(0.1)}`,
    alignItems: "center",
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: "center",
  };

  return (
    <Grid container columns={10}>
      <Grid item xs={8}>
        <Grid item xs={12}>
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              width: "100%",
              display: "flex",
            }}
          >
            <Tooltip sx={iconStyle} title="View Details">
              <ReadMoreIcon
                onClick={() => {
                  openModal({
                    name: "ViewItem",
                    task,
                    col,
                  });
                }}
                style={{
                  height: "fitContent",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            {task.comments?.length > 0 && (
              <Box sx={iconStyle}>
                <span
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "noWrap",
                    width: "fit-content",
                  }}
                >
                  <InsertCommentIcon
                    fontSize="tiny"
                    // onClick={() => {
                    //   openModal();
                    // }}
                  />
                  <Typography
                    whiteSpace={"nowrap"}
                    sx={{ p: "0 2px" }}
                    fontSize={"small"}
                  >
                    {task.comments.length}
                  </Typography>
                </span>
              </Box>
            )}
            {(task.images?.length > 0 || task.attachments.length > 0) && (
              <Box sx={iconStyle}>
                {ScrumItemIconDict.attachments("tiny").icon}
              </Box>
            )}
            {task.checklist?.length > 0 && (
              <Box sx={iconStyle}>
                {ScrumItemIconDict.checklist("tiny").icon}
              </Box>
            )}
            {/* {task.dates?.length > 0 && (
              <Box sx={iconStyle}>{ScrumItemIconDict.dates("tiny").icon}</Box>
            )} */}
          </span>
        </Grid>
      </Grid>
      {hoveredComponent === task.id &&
        !isDragging &&
        client.credentialsProvider().accessToken && (
          <Grid item xs={2}>
            <Grid item xs={12} container columns={2}>
              <CGrid item xs={1}>
                <Tooltip
                  title="Edit Task"
                  onClick={() => {
                    openModal({ name: "EditItem", task, col });
                  }}
                >
                  <EditIcon fontSize="small" />
                </Tooltip>
              </CGrid>
              <CGrid item xs={1}>
                <Tooltip title="Delete Task">
                  <DeleteIcon
                    fontSize="small"
                    onClick={() => {
                      openModal({ name: "DeleteItem", task, col });
                    }}
                  />
                </Tooltip>
              </CGrid>
            </Grid>
          </Grid>
        )}
    </Grid>
  );
}

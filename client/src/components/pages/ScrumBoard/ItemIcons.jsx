import React, { useEffect } from "react";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, Grid, Typography } from "@mui/material";

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
        opacity: display ? 0 : 1,
      }}
    >
      {props.children}
    </Grid>
  );

  return (
    <Grid container columns={10}>
      <Grid item xs={8}>
        <Grid item xs={12} container columns={8}>
          <CGrid>
            <Tooltip title="View Details">
              <ReadMoreIcon
                style={{
                  height: "fitContent",
                }}
                onClick={() => {
                  openModal({ name: "ViewItem", task });
                }}
              />
            </Tooltip>
          </CGrid>
          {task.comments?.length > 0 && (
            <Tooltip title="Comments">
              <span
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "noWrap",
                  width: "fit-content",
                }}
              >
                <CGrid>
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
                    {task.comments?.length}
                  </Typography>
                </CGrid>
              </span>
            </Tooltip>
          )}
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

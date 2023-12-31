import React from "react";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, Grid, Typography } from "@mui/material";

export default function ItemIcons({
  task,
  active,
  mouseIsOver,
  openModal,
  display,
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
                  openModal();
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
                    onClick={() => {
                      openModal();
                    }}
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
      {mouseIsOver && !active ? (
        <Grid item xs={2}>
          <Grid item xs={12} container columns={2}>
            <CGrid item xs={1}>
              <Tooltip title="Edit Task">
                <EditIcon fontSize="small" />
              </Tooltip>
            </CGrid>
            <CGrid item xs={1}>
              <Tooltip title="Delete Task">
                <DeleteIcon fontSize="small" />
              </Tooltip>
            </CGrid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

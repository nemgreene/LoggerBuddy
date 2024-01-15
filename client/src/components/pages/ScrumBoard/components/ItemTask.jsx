import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Grid, Typography } from "@mui/material";
import update from "immutability-helper";
import Delete from "@mui/icons-material/Delete";
import { Box, display } from "@mui/system";
import { useParams } from "react-router-dom";

export function ItemTask(props) {
  const params = useParams();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id, disabled: props.display });
  const { accessToken, _id } = useMemo(
    () => props.client.credentialsProvider(),
    [props.client]
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    width: "100%",
    userSelect: "none",
  };
  const handleChange = async () => {
    const up = update(
      [...props.task.checklist].map((v, i) => ({ ...v, index: i })),
      {
        [props.index]: {
          $set: { ...props.item, completed: !props.item.completed },
        },
      }
    );
    //if in add, this needs to be updated to the local state, but not to the db
    props.setChecklist(up);
  };
  const handleDelete = async (taskId, itemId) => {
    const up = update(
      [...props.task.checklist].map((v, i) => ({ ...v, index: i })),
      {
        $splice: [[props.index, 1]],
      }
    );
    props.setChecklist(up);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            disabled={accessToken && _id && !props.display ? false : true}
            checked={props.item.completed}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ cursor: props.display ? "auto" : "move" }}
            {...listeners}
          >
            {props.item.title}
          </Typography>
        </Box>

        <Box
          sx={{
            alignItems: "center",
            justifySelf: "stretch",
            display: "flex",
            marginLeft: "auto",
          }}
        >
          {accessToken && _id && !props.display && (
            <Button
              onClick={() => {
                console.log(props.task);
                handleDelete(props.task.id, props.item.id);
              }}
            >
              <Delete color="error" />
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
}

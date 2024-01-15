import { Card, Typography, CardContent, Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function ColumnDragging({
  setNodeRef,
  style,
  attributes,
  containerStyle,
  props,
  overlay,
}) {
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box
        sx={{
          ...containerStyle,
          height: "fit-content",
          opacity: overlay ? 1 : 0.5,
          border: (t) =>
            overlay ? "auto" : `1px solid ${t.palette.secondary.main}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              padding: (theme) => `${theme.spacing(1)} `,
              top: (t) => t.spacing(1),
              left: (t) => t.spacing(2.5),

              display: "flex",
              flexGrow: 1,
              flexWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              noWrap
              sx={{
                width: "100%",
                textOverflow: "ellipsis",
              }}
              variant="h6"
            >
              {props.col.title}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            height: "fit-content",
            maxHeight: "70vh",
            borderRadius: "inherit",
            overflowY: "scroll",
          }}
        >
          {props.tasks && (
            <Card
              sx={{
                borderRadius: "10px",
                padding: "0px",
                width: "100%",
                // padding: (theme) => `${theme.spacing(2)}`,
                // bgcolor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardContent>
                {props.tasks.map((item) => (
                  <SortableItem
                    overlay={overlay}
                    client={props.client}
                    hoveredComponent={props.hoveredComponent}
                    setHoveredComponent={props.setHoveredComponent}
                    openModal={props.openModal}
                    key={item.id}
                    id={item.id}
                    task={item}
                    active={props.active}
                    col={props.col}
                  />
                ))}
              </CardContent>
            </Card>
          )}
          <Button
            fullWidth
            onClick={() => {
              props.openModal({
                name: "AddItem",
                col: { ...props.col },
              });
            }}
            sx={{
              color: "white",
              borderRadius: "10px",
              opacity: 0,
              mt: (theme) => `${theme.spacing(1)} `,
            }}
          >
            <AddCircleIcon sx={{ m: (t) => t.spacing(1) }} />
            <Typography variant="body2">Add card</Typography>
          </Button>
        </Box>
      </Box>
    </div>
  );
}

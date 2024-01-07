import { Card, Typography, CardContent, Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function ColumnDragging({
  setNodeRef,
  style,
  attributes,
  containerStyle,
  props,
  theme,
  SortableContext,
  itemsIds,
}) {
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box
        sx={{
          ...containerStyle,
          opacity: props.active ? 0.5 : 1,
          border: props.active
            ? `1px solid ${theme.palette.primary.main}`
            : "none",
          height: "fit-content",
          // minHeight: "10px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            padding: (theme) => `${theme.spacing(1)} `,
            top: (t) => t.spacing(1),
            left: (t) => t.spacing(2.5),
            width: "90%",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {props.col.title} {props.col.index}
        </Typography>
        {!props.active && props.col.tasks && (
          <Card
            sx={{
              borderRadius: "20px",
              padding: "0px",
              width: "100%",
              // padding: (theme) => `${theme.spacing(2)}`,
              bgcolor: (theme) => theme.palette.background.paper,
            }}
          >
            <CardContent>
              <SortableContext
                items={itemsIds}
                strategy={verticalListSortingStrategy}
              >
                {props.tasks.map((item) => (
                  <SortableItem
                    overlay={props.active}
                    key={item.id}
                    id={item.id}
                    task={item}
                    active={props.active}
                  />
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        )}
        <Button
          fullWidth
          sx={{
            color: "white",
            borderRadius: "10px",
            opacity: props.active ? 0 : 1,
          }}
        >
          <AddCircleIcon sx={{ m: (t) => t.spacing(1) }} />
          <Typography variant="body2">Add card</Typography>
        </Button>
      </Box>
    </div>
  );
}

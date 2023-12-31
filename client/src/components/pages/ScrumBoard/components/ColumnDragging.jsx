import { Card, Typography, CardContent } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";

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
          // minHeight: "10px",
        }}
      >
        {!props.active && (
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
        )}
        {!props.active && (
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
                {props.items.map((item) => (
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
      </Box>
    </div>
  );
}

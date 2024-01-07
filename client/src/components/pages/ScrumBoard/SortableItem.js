import { useEffect, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import ItemIcons from "./ItemIcons";

export default function SortableItem({
  task,
  overlay,
  openModal,
  active,
  hoveredComponent,
  setHoveredComponent,
  col,
  client,
}) {
  const { accessToken, _id } = useMemo(
    () => client.credentialsProvider(),
    [client]
  );
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: accessToken && _id ? false : true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: "none",
  };
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={{ ...style, opacity: 0.5 }} {...attributes}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{ paddingBottom: (theme) => `${theme.spacing(2)} ` }}
              >
                {task.title}
              </Grid>
              <ItemIcons task={task} active={true} />
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (overlay) {
    return (
      <div ref={setNodeRef} style={{ ...style }} {...attributes}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{ paddingBottom: (theme) => `${theme.spacing(2)} ` }}
              >
                {task.title}
              </Grid>
              <ItemIcons task={task} active={true} />
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        onMouseEnter={() => {
          setHoveredComponent && setHoveredComponent(task.id);
        }}
        onMouseLeave={() => setHoveredComponent && setHoveredComponent(null)}
      >
        <CardContent>
          <Grid container sx={{ cursor: "move" }} {...listeners}>
            <Grid
              item
              xs={12}
              sx={{
                paddingBottom: (theme) => `${theme.spacing(2)} `,
                cursor: accessToken && _id ? "move" : "auto",
              }}
            >
              {task.title}
            </Grid>
          </Grid>
          <ItemIcons
            client={client}
            col={col}
            hoveredComponent={hoveredComponent}
            task={task}
            isDragging={isDragging}
            active={active}
            openModal={openModal}
          />
        </CardContent>
      </Card>
    </div>
  );
}

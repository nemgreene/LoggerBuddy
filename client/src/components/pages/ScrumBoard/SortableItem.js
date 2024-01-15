import { useEffect, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import ItemIcons from "./ItemIcons";
import ItemDates from "./components/ItemDates";

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
    marginBottom: "5px",
  };

  const TaskTitle = ({ children, sx }) => {
    return (
      <Typography variant="body2" sx={{ ...sx }}>
        {children}
      </Typography>
    );
  };

  const cardContent = {
    p: (t) => `${t.spacing(1)} ${t.spacing(2)} `,
    "&:last-child": {
      paddingBottom: (t) => `calc(${t.spacing(2)} - 2px)`,
    },
  };

  const Labels = () => (
    <Box>
      <span
        style={{
          flexGrow: 1,
          width: "100%",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <span>
          {task.labels.map((v, i) => (
            <Chip
              key={i}
              sx={{
                bgcolor: v.color,
                mr: (t) => t.spacing(0.5),
              }}
              label={v.label}
            ></Chip>
          ))}
        </span>
      </span>
    </Box>
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        onMouseEnter={() => {
          setHoveredComponent && setHoveredComponent(task.id);
        }}
        onMouseLeave={() => setHoveredComponent && setHoveredComponent(null)}
      >
        <CardContent
          sx={
            !isDragging
              ? {
                  p: (t) => `${t.spacing(1)} ${t.spacing(2)} `,
                  "&:last-child": {
                    paddingBottom: (t) => t.spacing(2),
                  },
                }
              : {
                  ...cardContent,
                  opacity: 0.5,
                  border: (t) => `1px solid ${t.palette.primary.main}`,
                  borderRadius: "7px",
                }
          }
        >
          <Grid container sx={{ cursor: "move" }} {...listeners}>
            <Grid
              item
              xs={12}
              sx={{
                cursor: accessToken && _id ? "move" : "auto",
              }}
            >
              <TaskTitle>
                {task.title}
                <span style={{ opacity: 0.5 }}> #{task.issueNumber}</span>
              </TaskTitle>
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
          {task.labels.length > 0 && <Labels />}
          {task.dates.length > 0 && <ItemDates dates={task.dates} />}
        </CardContent>
      </Card>
    </div>
  );
}

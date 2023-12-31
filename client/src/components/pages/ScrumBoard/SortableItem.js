import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import ItemIcons from "./ItemIcons";
// import { Id, Task } from "../types";
// import TrashIcon from "../icons/TrashIcon";

// https://github.com/Kliton/react-kanban-board-dnd-kit-tutorial-yt/blob/main/src/components/KanbanBoard.tsx

export default function TaskCard({ task, active, openModal, overlay }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const theme = useTheme();
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
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const ItemCard = styled(Card)(({ theme }) => {
    return {
      margin: theme.spacing(1),
      cursor: "move",
      borderRadius: "5px",
      border: isDragging
        ? `1px solid ${theme.palette.primary.main}`
        : `1px solid ${theme.palette.primary.main}`,
    };
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  // if (toggle) {
  //   console.log(task);
  // }

  if (isDragging || overlay) {
    return (
      <div ref={setNodeRef} style={{ ...style, opacity: 0.5 }}>
        <ItemCard>
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{ paddingBottom: `${theme.spacing(2)} `, opacity: 0 }}
              >
                {task.title}
              </Grid>
              <ItemIcons
                display={true}
                task={task}
                active={active}
                mouseIsOver={mouseIsOver}
                openModal={openModal}
              />
            </Grid>
          </CardContent>
        </ItemCard>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <ItemCard>
        <CardContent>
          <Grid container>
            <Grid item xs={12} sx={{ paddingBottom: `${theme.spacing(2)} ` }}>
              {task.title}
            </Grid>
            <ItemIcons
              task={task}
              active={active}
              mouseIsOver={mouseIsOver}
              openModal={openModal}
            />
          </Grid>
        </CardContent>
      </ItemCard>
    </div>
  );
}

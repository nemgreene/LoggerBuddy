import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { Box, styled } from "@mui/system";

// import { SortableItem } from "./SortableItem";
import Container from "./Container";
import { CardContent, Grid, Typography } from "@mui/material";
import SortableItem from "./SortableItem";

export default function MultipleContainers({
  openModal,
  columns,
  items,
  setColumns,
  setItems,
  client,
  trackedStream,
  credentials,
}) {
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const columnSort = useMemo(() => columns.map((col) => col.id), [columns]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const colBoxStyle = { width: "22.22vw" };

  useEffect(() => {}, [columns]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "scroll",
          width: "fit-content",
        }}
      >
        <SortableContext
          items={columnSort}
          strategy={horizontalListSortingStrategy}
          modifiers={[restrictToHorizontalAxis]}
        >
          {columns.map((col, index) => (
            <Box sx={{ ...colBoxStyle }} key={col.id} id={col.id}>
              <Container
                credentials={credentials}
                openModal={openModal}
                col={col}
                key={col.id}
                id={col.id}
                active={activeColumn !== null || activeTask !== null}
                items={items.filter((item) => item.columnId === col.id)}
              />
              {/* <Container key={item.id} column={item} /> */}
            </Box>
            // <SortableItem key={id} id={id} />
          ))}
        </SortableContext>
        <Box sx={{ ...colBoxStyle }}>
          <Container items={[]} col={[]} addCol={true} openModal={openModal} />
        </Box>
      </Box>
      <DragOverlay>
        {activeColumn && (
          <Box sx={{ ...colBoxStyle }}>
            <Container
              overlay={true}
              col={columns[columns.findIndex((x) => x.id === activeColumn)]}
              key={activeColumn.id}
              id={activeColumn.id}
              items={items.filter((item) => item.columnId === activeColumn)}
            ></Container>
          </Box>
        )}
        {activeTask && <SortableItem task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );

  async function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    let updated = arrayMove(columns, activeColumnIndex, overColumnIndex);
    updated = updated.map((v, index) => ({ ...v, index }));

    setColumns(updated);

    const ret = await client.updateColumns(trackedStream, updated);
    if (ret.status !== 200) {
      client.modalhandler(400, "Sorry, something went wrong...");
      setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setItems((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setItems((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

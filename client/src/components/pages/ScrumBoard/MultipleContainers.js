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
import ScrumContainer from "./ScrumContainer";
import SortableItem from "./SortableItem";
import ScrumNav from "./ScrumNav";
import { Card, CardContent, Typography } from "@mui/material";

export default function MultipleContainers({
  openModal,
  columns,
  tasks,
  setColumns,
  setTasks,
  client,
  trackedStream,
  credentials,
}) {
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  const columnSort = useMemo(() => columns.map((col) => col.id), [columns]);

  const { accessToken, _id } = useMemo(
    () => client.credentialsProvider(),
    [client]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const colBoxStyle = {
    width: "22.22vw",
    minWidth: "300px",
  };

  return (
    <Box>
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
            m: "5px 0px",
          }}
        >
          <SortableContext
            items={columnSort}
            strategy={horizontalListSortingStrategy}
            modifiers={[restrictToHorizontalAxis]}
          >
            {columns.map((col, index) => (
              <Box sx={{ ...colBoxStyle }} key={col.id} id={col.id}>
                <ScrumContainer
                  client={client}
                  hoveredComponent={hoveredComponent}
                  setHoveredComponent={setHoveredComponent}
                  credentials={credentials}
                  openModal={openModal}
                  col={col}
                  key={col.id}
                  id={col.id}
                  active={activeColumn !== null || activeTask !== null}
                  tasks={tasks.filter((item) => {
                    return item.columnId == col.id;
                  })}
                />
              </Box>
            ))}
          </SortableContext>
          {accessToken && _id && (
            <Box sx={{ ...colBoxStyle, height: "100%" }}>
              <ScrumContainer
                tasks={[]}
                col={[]}
                addCol={true}
                openModal={openModal}
                client={client}
              />
            </Box>
          )}

          {(!accessToken || !_id) && tasks.length == 0 && (
            <Box>
              <Card sx={{ m: (t) => t.spacing(1), width: "250px" }}>
                <CardContent>
                  <Typography>No Scrum Data yet...</Typography>
                </CardContent>
              </Card>
              <Card sx={{ m: (t) => t.spacing(1), width: "250px" }}>
                <CardContent>
                  <Typography>Come back soon!</Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
        <DragOverlay>
          {activeColumn && (
            <Box sx={{ ...colBoxStyle }}>
              <ScrumContainer
                client={client}
                hoveredComponent={hoveredComponent}
                setHoveredComponent={setHoveredComponent}
                overlay={true}
                col={columns[columns.findIndex((x) => x.id === activeColumn)]}
                key={activeColumn.id}
                id={activeColumn.id}
                tasks={tasks.filter((item) => item.columnId === activeColumn)}
              ></ScrumContainer>
            </Box>
          )}
          {activeTask && (
            <SortableItem client={client} task={activeTask} overlay={true} />
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  );

  async function onDragStart(event) {
    // if (!accessToken || !_id) {
    //   return;
    // }
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
    // if (!accessToken || !_id) {
    //   return;
    // }
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

  async function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    //dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
        // Fix introduced
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        const update = arrayMove(tasks, activeIndex, overIndex - 1);
        setTasks(update);

        const ret = await client.updateTasks(trackedStream, update);
        if (ret.status !== 200) {
          client.modalhandler(400, "Sorry, something went wrong...");
          setTasks(arrayMove(tasks, activeIndex, activeIndex));
        }
        return;
      }

      const update = arrayMove(tasks, activeIndex, overIndex);
      setTasks(update);

      const ret = await client.updateTasks(trackedStream, update);
      if (ret.status !== 200) {
        client.modalhandler(400, "Sorry, something went wrong...");
        setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
      return;
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const temp = [...tasks];
      const activeIndex = temp.findIndex((t) => t.id === activeId);
      temp[activeIndex].columnId = overId;
      const update = arrayMove(tasks, activeIndex, activeIndex);

      setTasks(update);

      const ret = await client.updateTasks(trackedStream, update);
      if (ret.status !== 200) {
        client.modalhandler(400, "Sorry, something went wrong...");
        setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
    }
  }
}

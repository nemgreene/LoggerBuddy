import React, { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ItemTask } from "./ItemTask";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { Box } from "@mui/system";

export function ItemChecklist({ task, tasks, setTasks, add, client, display }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemSort = useMemo(() => {
    return task.checklist.map((v) => v.id);
  }, [task]);

  return (
    <Box sx={{ width: "100%", pr: (t) => t.spacing(2) }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={itemSort}
          strategy={verticalListSortingStrategy}
        >
          {task.checklist.map((item, index) => (
            <ItemTask
              display={display}
              index={index}
              client={client}
              add={add}
              key={item.id}
              id={item.id}
              task={task}
              item={{ ...item, index }}
              tasks={tasks}
              setTasks={setTasks}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      if (add) {
        setTasks((p) => {
          const oldIndex = p.findIndex((t) => t.id === active.id);
          const newIndex = p.findIndex((t) => t.id === over.id);
          const up = arrayMove(task.checklist, oldIndex, newIndex);
          return up.map((v, i) => ({ ...v, index: 1 }));
        });
        return;
      }
      setTasks((tasks) => {
        const oldIndex = task.checklist.findIndex((t) => t.id === active.id);
        const newIndex = task.checklist.findIndex((t) => t.id === over.id);
        const up = arrayMove(task.checklist, oldIndex, newIndex);

        const ret = [...tasks].map((v) =>
          v.id === task.id ? { ...v, checklist: up } : v
        );
        return ret;
      });
    }
  }
}

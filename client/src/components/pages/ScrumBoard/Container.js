import SortableItem from "./SortableItem";
import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import ColumnAdd from "./components/ColumnAdd";
import ColumnDragging from "./components/ColumnDragging";

const CGrid = (props) => (
  <Grid
    item={true}
    xs={1}
    sx={{
      cursor: "pointer",
      alignItems: "center",
      display: "flex",
      alignItems: "center",
      flexWrap: "noWrap",
      width: "fit-content",
      // color: (theme) => "#121212;",
    }}
  >
    {props.children}
  </Grid>
);

export default function Container(props) {
  const theme = useTheme();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    data: {
      type: "Column",
      items: props.items,
      column: props.id,
      index: props.index,
    },
  });

  const itemsIds = useMemo(() => {
    return props.items.map((item) => item.id);
  }, [props.items]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "5px",
    maxHeight: "90vh",
    height: "100%",
  };

  const containerStyle = {
    height: "90vh",
    minHeight: "10vh",
    overflowY: "scroll",
    borderRadius: "10px",
    backgroundColor: props.col.color,
    padding: (t) => t.spacing(1),
  };

  if (props.addCol) {
    return <ColumnAdd containerStyle={containerStyle} props={props} />;
  }

  if (isDragging) {
    return (
      <ColumnDragging
        setNodeRef={setNodeRef}
        style={style}
        attributes={attributes}
        containerStyle={containerStyle}
        props={props}
        theme={theme}
        SortableContext={SortableContext}
        itemsIds={itemsIds}
        active={true}
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box sx={{ ...containerStyle }}>
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

              width: "80%",
              flexWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              noWrap
              {...listeners}
              sx={{
                width: "100%",
                textOverflow: "ellipsis",
              }}
              variant="h6"
            >
              {props.col.title} {props.col.index}
            </Typography>
          </Box>
          {props.credentials._id && props.credentials.accessToken && (
            <Box sx={{ width: "20%" }}>
              <Grid item xs={12} container columns={2} sx={{ height: "100%" }}>
                <CGrid item xs={1}>
                  <Tooltip
                    title="Edit Column"
                    onClick={() =>
                      props.openModal({
                        name: "EditColumn",
                        data: { ...props.col },
                      })
                    }
                  >
                    <EditIcon fontSize="small" />
                  </Tooltip>
                </CGrid>
                <CGrid item xs={1}>
                  <Tooltip title="Delete Column">
                    <DeleteIcon
                      fontSize="small"
                      onClick={() => props.openModal("DeleteColumn")}
                    />
                  </Tooltip>
                </CGrid>
              </Grid>
            </Box>
          )}
        </Box>
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
                  openModal={props.openModal}
                  key={item.id}
                  id={item.id}
                  task={item}
                  active={props.active}
                />
              ))}
            </SortableContext>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

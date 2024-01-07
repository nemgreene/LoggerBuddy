import SortableItem from "./SortableItem";
import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

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

export default function ScrumContainer(props) {
  const { accessToken, _id } = useMemo(
    () => props.client.credentialsProvider(),
    [props.client]
  );

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
      tasks: props.tasks,
      column: props.id,
      index: props.index,
    },
    disabled: accessToken && _id ? false : true,
  });

  const itemsIds = useMemo(() => {
    return props.tasks.map((item) => item.id);
  }, [props.tasks]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "0px 5px",
    height: "100%",
    userSelect: "none",
  };

  const containerStyle = {
    minHeight: "10vh",
    overflowY: "scroll",
    borderRadius: "10px",
    height: "100%",
    backgroundColor: props.col.color + "60",
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
      <Box sx={{ ...containerStyle, height: "fit-content" }}>
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
                cursor: accessToken && _id ? "move" : "auto",
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
                      onClick={() =>
                        props.openModal({
                          name: "DeleteColumn",
                          data: { ...props.col },
                        })
                      }
                    />
                  </Tooltip>
                </CGrid>
              </Grid>
            </Box>
          )}
        </Box>
        {props.tasks && (
          <Card
            sx={{
              borderRadius: "10px",
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
              </SortableContext>
            </CardContent>
          </Card>
        )}
        {accessToken && _id && (
          <Button
            fullWidth
            onClick={() => {
              props.openModal({
                name: "AddItem",
                col: { ...props.col },
              });
            }}
            sx={{ color: "white", borderRadius: "10px" }}
          >
            <AddCircleIcon sx={{ m: (t) => t.spacing(1) }} />
            <Typography variant="body2">Add card</Typography>
          </Button>
        )}
      </Box>
    </div>
  );
}

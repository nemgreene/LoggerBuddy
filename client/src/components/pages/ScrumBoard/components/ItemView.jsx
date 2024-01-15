import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { ItemChecklist } from "./ItemChecklist";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SubjectIcon from "@mui/icons-material/Subject";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";
import ItemComments from "./ItemComments";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import { GridRow, GridCap, GridCol, linkIcons } from "../../../Utility";
import Pictures from "../../../Pictures";
import ItemDates from "./ItemDates";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ItemView({
  task,
  display,
  setTasks,
  client,
  tasks,
  col,
  edit,
}) {
  // const [checklist, setItems] = useState(task.checklist || []);

  const completed = useMemo(() => {
    const operator = task.checklist;
    return Math.round(
      (operator.reduce((a, c) => (a = c.completed ? a + 1 : a), 0) /
        operator.length) *
        100
    );
  }, [task, tasks]);

  const Header = ({ sx, children }) => {
    return (
      <Typography variant="body2" sx={{ ...sx, opacity: 0.5 }}>
        {children}
      </Typography>
    );
  };

  return (
    <Card
      sx={{
        maxHeight: "90vh",
        overflowY: "scroll",
        maxWidth: "45vw",
        width: "100%",
      }}
    >
      <CardContent>
        <Grid container>
          <GridRow item xs={12} container>
            <GridCap>
              <AssignmentIcon />
            </GridCap>
            <GridCol>
              <Typography variant="h5">{task.title}</Typography>
              {!isNaN(task.issueNumber) && (
                <Typography
                  variant="h6"
                  sx={{ pl: "7px", opacity: 0.5, fontStyle: "italic" }}
                >
                  #{task.issueNumber}
                </Typography>
              )}
            </GridCol>
            <GridCap />
            <GridCol>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  p: (t) => `${t.spacing(1)} 0px`,
                  alignItems: "center",
                }}
              >
                <Header sx={{ flexGrow: 3, height: "100%" }}>
                  {col && (
                    <span>
                      in list <a>{col.title}</a>
                    </span>
                  )}
                </Header>
                {task.labels.length > 0 && (
                  <span
                    style={{
                      flexGrow: 1,
                      maxWidth: "60%",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
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
                )}
                {task.checklist.length > 0 && (
                  <span
                    style={{
                      flexGrow: 1,
                      maxWidth: "60%",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
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
                )}
              </Box>
            </GridCol>
          </GridRow>

          {/* description */}
          <GridRow item xs={12} container>
            <GridCap>
              <SubjectIcon />
            </GridCap>
            <GridCol>
              <Header>Description</Header>
            </GridCol>
            <GridCap></GridCap>
            <GridCol>
              <Typography
                style={{ whiteSpace: " pre-line" }}
                variant="body1"
                color="text.secondary"
              >
                {task.description}
              </Typography>
            </GridCol>
          </GridRow>

          {/* attachments */}
          {task.images?.length > 0 && (
            <GridRow item xs={12} container>
              <GridCap>
                <ImageIcon />
              </GridCap>
              <GridCol>
                <Header>Images</Header>
              </GridCol>
              <GridCap></GridCap>
              <GridCol>
                <Pictures images={task.images} />
              </GridCol>
            </GridRow>
          )}
          {/* attachments */}
          {task.attachments.length > 0 && (
            <GridRow item xs={12} container>
              <GridCap>
                <AttachFileIcon />
              </GridCap>
              <GridCol>
                <Header>Attachments</Header>
              </GridCol>
              <GridCap></GridCap>
              <GridCol>
                {task.attachments.map((v, k) => {
                  return (
                    <Tooltip key={k} title={v.tooltip}>
                      <a target="_blank" href={v.url}>
                        <IconButton aria-label={v.tooltip}>
                          {linkIcons[v.icon]}
                        </IconButton>
                      </a>
                    </Tooltip>
                  );
                })}
              </GridCol>
            </GridRow>
          )}

          {/* checklist */}
          {task.checklist.length > 0 && (
            <GridRow item xs={12} container>
              <GridCap>
                <ChecklistIcon sx={{ mr: (t) => t.spacing(1) }} />
              </GridCap>
              <GridCol>
                <Header>Checklist</Header>
              </GridCol>
              <GridCap>
                <Typography sx={{ mr: (t) => t.spacing(1) }}>
                  {completed}%
                </Typography>
              </GridCap>
              <GridCol>
                <LinearProgress
                  sx={{ width: "100%" }}
                  variant="determinate"
                  value={completed}
                />
              </GridCol>
              <GridCap />
              <GridCol>
                <ItemChecklist
                  display={display}
                  task={task}
                  client={client}
                  tasks={tasks}
                  setTasks={setTasks}
                />
              </GridCol>
            </GridRow>
          )}
          {/* comments */}
          {task.comments.length > 0 && (
            <GridRow item xs={12} container>
              <GridCap>
                <CommentIcon />
              </GridCap>
              <GridCol>
                <Header>Comments</Header>
              </GridCol>
              <GridCap></GridCap>
              <GridCol>
                <ItemComments
                  edit={edit}
                  client={client}
                  setTasks={setTasks}
                  display={display}
                  comments={task.comments}
                  task={task}
                />
              </GridCol>
            </GridRow>
          )}
          {/* comments */}
          {task.dates.length > 0 && (
            <GridRow item xs={12} container>
              <GridCap>
                <CalendarMonthIcon />
              </GridCap>
              <GridCol>
                <Header>Dates</Header>
              </GridCol>
              <GridCap></GridCap>
              <GridCol>
                <ItemDates dates={task.dates} />
              </GridCol>
            </GridRow>
          )}
        </Grid>
        {/* <EditItemView /> */}
      </CardContent>
    </Card>
  );
}

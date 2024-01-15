import {
  Button,
  Card,
  CardContent,
  FormLabel,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ItemChecklist } from "../ItemChecklist";
import { Box } from "@mui/system";
import { FormSkeleton } from "../../../../Utility";

export default function ItemFormChecklist({
  checklist,
  setChecklist,
  formError,
  changeFormErrors,
  client,
  task,
  tasks,
  edit,
  editIndex,
  changeEditIndex,
}) {
  const [newItem, changeNewItem] = useState({
    id: "",
    title: "",
    completed: false,
  });
  const handleSubmit = async () => {
    if (!newItem.title) {
      changeFormErrors((p) => ({ ...p, checklist: false }));
    } else {
      setChecklist((p) => {
        return [...p, { ...newItem }];
      });
      changeFormErrors((p) => ({
        ...p,
        checklist: null,
        checklistToggle: null,
      }));
      changeNewItem({
        id: "",
        title: "",
        completed: false,
      });
    }
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", p: (t) => t.spacing(1) }}
            >
              Checklist
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {checklist.length > 0 ? (
              <ItemChecklist
                parent="formChecklist"
                task={{ ...task, checklist }}
                tasks={tasks}
                client={client}
                setChecklist={setChecklist}
              />
            ) : (
              <FormSkeleton />
            )}
          </Grid>
          {!newItem.id && (
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  changeFormErrors((p) => ({ ...p, checklistToggle: false }));
                  changeNewItem({
                    id: checklist.length + 1,
                    title: "",
                    completed: false,
                  });
                }}
              >
                New Item
              </Button>
            </Grid>
          )}
          {newItem.id && (
            <Grid
              container
              sx={{ alignItems: "center", height: "fit-content" }}
            >
              <Grid item xs={12} sx={{ pt: (t) => t.spacing(2) }}>
                <FormLabel>Add Item</FormLabel>
              </Grid>
              <Grid
                item
                xs={12}
                container
                sx={{ alignItems: "center", height: "fit-content" }}
              >
                <Grid
                  item
                  xs={6}
                  sx={{ p: (t) => t.spacing(1), height: "fit-content" }}
                >
                  <TextField
                    sx={{ m: "0px" }}
                    fullWidth
                    margin="normal"
                    error={formError.checklist === false}
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    value={newItem.title}
                    name="title"
                    onInput={(e) => {
                      changeFormErrors((p) => ({ ...p, checklist: "" }));
                      changeNewItem((p) => ({ ...p, title: e.target.value }));
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    height: "110%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    fullWidth
                    sx={{ m: (t) => t.spacing(1) }}
                    onClick={handleSubmit}
                    variant="contained"
                  >
                    Submit
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    sx={{ m: (t) => t.spacing(1) }}
                    onClick={() => {
                      changeFormErrors((p) => ({
                        ...p,
                        checklistToggle: "",
                        checklist: "",
                      }));
                      changeNewItem({
                        id: "",
                        title: "",
                        completed: false,
                      });
                    }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

import {
  Button,
  Card,
  CardContent,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ItemChecklist } from "../ItemChecklist";

export default function ItemFormChecklist({
  checklist,
  setTasks,
  formError,
  changeFormErrors,
  client,
  task,
  tasks,
  add,
  ...rest
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
      if (add) {
        console.log("in add");
        setTasks((p) => {
          return [...p, { ...newItem }];
        });
        changeNewItem({
          id: "",
          title: "",
          completed: false,
        });
        return;
      }
      console.log("in edit");
      let res = await client.taskUpdate(task.id, {
        ...task,
        checklist: [...task.checklist, { ...newItem }],
      });
      console.log(res);
      if (res.status === 200) {
        setTasks((p) => {
          return res.data;
        });
      }

      //add to db
      //get new unique id
      // //add into posts
      // setTasks((p) => {
      //   let up = [...p].map((v) =>
      //     v.id === task.id
      //       ? { ...v, checklist: [...checklist, { ...newItem }] }
      //       : v
      //   );
      //   console.log(up, task.id);
      //   // let ret = [...p].map((v, i) => ({ ...v, index: i }));
      //   // return [...ret, { ...newItem, index: checklist.length + 1 }];
      //   return up;
      // });
      changeNewItem({
        id: "",
        title: "",
        completed: false,
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Checklist</Typography>
          </Grid>
          <Grid item xs={12}>
            <ItemChecklist
              parent="formChecklist"
              task={{ ...task, checklist }}
              tasks={tasks}
              client={client}
              setTasks={setTasks}
              add={add}
            />
          </Grid>
          {!newItem.id && (
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
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

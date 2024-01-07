import { styled } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Fab,
  FormLabel,
  Grid,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";

import { GridRow, ScrumItemIconDict } from "../../../Utility";
import ItemView from "./ItemView";
import StreamLinksTable from "../../../StreamLinksTable";
import { ItemChecklist } from "./ItemChecklist";
import Checkbox from "@mui/material/Checkbox";
import ItemFormChecklist from "./ItemForms/ItemFormChecklist";
import CircleIcon from "@mui/icons-material/Circle";
import ItemFormHome from "./ItemForms/ItemFormHome";
import DragAndDrop from "../../../DragAndDrop";
import ItemFormAttachments from "./ItemForms/ItemFormAttachments";
//public item view
export default function ItemForm({
  edit = undefined,
  add,
  col,
  client,
  setTasks,
  task,
  handleClose,
  tasks,
}) {
  const [form, changeForm] = useState({
    title: edit?.title || "",
    description: edit?.description || "",
    comments: edit?.comments || [],
    labels: edit?.labels || [],
    dates: edit?.dates || [],
    attachments: edit?.attachments || [],
    integrations: edit?.integrations || [],
  });

  const [formError, changeFormErrors] = useState({});
  ///attachments
  const [attachments, changeLinks] = useState(edit?.attachments || []);
  const [editIndex, changeEditIndex] = useState();

  const [images, changeImages] = useState();
  //checklist
  const [checklist, setChecklist] = useState(add ? [] : task.checklist);

  const [activeForm, changeActiveForm] = useState("home");
  const handleChange = (e) => {
    changeFormErrors((p) => ({ ...p, [e.target.name]: null }));
    changeForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // id: "", //assigned on submit
    // issueNumber: "", //assigned on submit
    const errors = {};
    ["description", "title"].forEach((v) => {
      if (!form[v]) {
        errors[v] = false;
      }
    });
    if (JSON.stringify(errors).includes("false") || !isNaN(editIndex)) {
      changeFormErrors((p) => ({ ...p, ...errors }));
      client.modalHandler(400, "Please fill out required forms");
      return;
    }
    //form sufficiently filled, add to db

    if (edit) {
      const res = await client.updateItem(col.trackedStream, {
        ...task,
        ...form,
        columnId: col.id,
        attachments: attachments,
        checklist: task.checklist,
      });
      if (res.status === 200) {
        setTasks(res.data.tasks);
        handleClose();
      }
    } else {
      const res = await client.addItem(col.trackedStream, {
        ...form,
        columnId: col.id,
        attachments: attachments,
        checklist: checklist,
      });
      if (res.status === 200) {
        setTasks(res.data.tasks);
        handleClose();
      }
    }
  };

  const activeView = {
    home: (
      <ItemFormHome
        edit={edit}
        form={form}
        formError={formError}
        handleChange={handleChange}
      />
    ),
    checklist: (
      <ItemFormChecklist
        task={task}
        tasks={tasks}
        add={add}
        client={client}
        checklist={edit ? task.checklist : checklist}
        setTasks={edit ? setTasks : setChecklist}
        formError={formError}
        changeFormErrors={changeFormErrors}
      />
    ),
    attachments: (
      <ItemFormAttachments
        images={images}
        changeImages={changeImages}
        editIndex={editIndex}
        changeEditIndex={changeEditIndex}
        client={client}
        attachments={attachments}
        changeLinks={changeLinks}
      />
    ),
    comments: <>comments</>,
    labels: <>labels</>,
    dates: <>dates</>,
  };

  return (
    <Box sx={{ width: "80vw", minHeight: "50vh" }}>
      {Object.keys(ScrumItemIconDict).map((v, i) => {
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              transform: `translate(-120%, ${i * 120}%)`,
              color: "primary.dark.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {activeForm === v && <CircleIcon fontSize="7" sx={{ mr: "7px" }} />}
            <Fab
              sx={{
                bgcolor:
                  form[v]?.length > 0 ? "secondary.main" : "primary.main",
              }}
              onClick={() => {
                changeActiveForm(v);
              }}
              size="large"
            >
              {ScrumItemIconDict[v]("medium").icon}
            </Fab>
          </Box>
        );
      })}

      <Grid container>
        <Grid item xs={6} sx={{ p: (t) => t.spacing(1) }}>
          {activeView[activeForm]}
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="outlined"
            sx={{ m: (t) => `${t.spacing(2)} 0px` }}
          >
            {edit ? "Submit Changes" : "Add Item"}
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ height: "100%", p: (t) => t.spacing(1) }}>
          <Box sx={{ width: "100%" }}>
            <ItemView
              tasks={tasks}
              client={client}
              display={true}
              setTasks={setTasks}
              parent={"Item Form"}
              task={{
                ...task,
                columnTitle: col.title,
                ...form,
                images,
                attachments: attachments,
                title: form.title ? form.title : "Title here...",
                description: form.description ? form.description : "...",
                checklist: add ? checklist : task.checklist,
              }}
            ></ItemView>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

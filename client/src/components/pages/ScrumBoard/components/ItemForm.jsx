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
import { Box, Container, display } from "@mui/system";
import React, { useEffect, useState } from "react";

import { GridRow, ScrumItemIconDict } from "../../../Utility";
import ItemView from "./ItemView";

import ItemFormChecklist from "./ItemForms/ItemFormChecklist";
import ItemFormHome from "./ItemForms/ItemFormHome";
import ItemFormAttachments from "./ItemForms/ItemFormAttachments";
import ItemFormsComments from "./ItemForms/ItemFormsComments";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ItemFormNavbar from "./ItemForms/ItemFormNavbar";
import ItemFormLabels from "./ItemForms/ItemFormLabels";
import ItemFormDates from "./ItemForms/ItemFormDates";
//public item view
export default function ItemForm({
  edit = undefined,
  col,
  client,
  setTasks,
  task,
  handleClose,
  tasks,
  possibleLabels = [],
}) {
  const [errorArray, changeErrorArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [form, changeForm] = useState({
    title: edit?.title || "",
    description: edit?.description || "",
    comments: edit?.comments || [],
    labels: edit?.labels || [],
    dates: edit?.dates || [],
    attachments: edit?.attachments || [],
    integrations: edit?.integrations || [],
  });
  ///attachments
  const [attachments, changeLinks] = useState(edit?.attachments || []);
  const [editIndex, changeEditIndex] = useState();
  //checklist
  const [checklist, setChecklist] = useState(edit?.checklist || []);

  const [images, changeImages] = useState(edit?.images || undefined);
  const [formError, changeFormErrors] = useState({});

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
      console.log(v);
      if (!form[v]) {
        errors[v] = false;
      }
    });
    if (JSON.stringify(errors).includes("false")) {
      changeFormErrors((p) => ({ ...p, ...errors }));
      client.modalHandler(400, "Please fill out required forms");
      return;
    }
    // client.modalHandler(200, "Submitting");
    // form sufficiently filled, add to db
    if (edit) {
      const res = await client.updateItem(col.trackedStream, {
        ...task,
        ...form,
        columnId: col.id,
        attachments: attachments,
        images,
        checklist: checklist,
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
        images,
        checklist: checklist,
      });
      if (res.status === 200) {
        setTasks(res.data.tasks);
        handleClose();
      }
    }
  };
  const handleNav = (v) => {
    if (!form.title || !form.description) {
      return client.modalHandler(400, "Title And Description Required");
    }

    console.log(formError);
    if (JSON.stringify(Object.values(formError)).includes("false")) {
      return client.modalHandler(400, "Please resolve form to proceed");
    }
    console.log("navving");
    changeActiveForm(v);
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
        client={client}
        checklist={checklist}
        setChecklist={setChecklist}
        formError={formError}
        changeFormErrors={changeFormErrors}
        editIndex={editIndex}
        changeEditIndex={changeEditIndex}
      />
    ),
    attachments: (
      <ItemFormAttachments
        changeFormErrors={changeFormErrors}
        client={client}
        images={images}
        editIndex={editIndex}
        attachments={attachments}
        changeLinks={changeLinks}
        changeImages={changeImages}
        changeEditIndex={changeEditIndex}
        changeForm={changeForm}
      />
    ),
    comments: (
      <ItemFormsComments
        task={task}
        client={client}
        form={form}
        setTasks={setTasks}
        formError={formError}
        changeForm={changeForm}
        changeFormErrors={changeFormErrors}
      />
    ),
    labels: (
      <ItemFormLabels
        form={form}
        changeForm={changeForm}
        possibleLabels={possibleLabels}
      />
    ),
    dates: (
      <ItemFormDates
        form={form}
        changeForm={changeForm}
        client={client}
        formError={formError}
        changeFormErrors={changeFormErrors}
      />
    ),
  };

  return (
    <Box
      sx={{
        width: "80vw",
        minHeight: "55vh",
        // height: "50vh",
        display: "relative",
      }}
    >
      <ItemFormNavbar
        editIndex={editIndex}
        changeEditIndex={changeEditIndex}
        activeForm={activeForm}
        errorArray={errorArray}
        activeArray={[
          form.title && form.description,
          checklist.length > 0,
          form.attachments.length > 0 || images,
          form.comments.length > 0,
          form.labels.length > 0,
          form.dates.length > 0,
        ]}
        changeActiveForm={handleNav}
      />
      <Tooltip title={edit ? "Submit Changes" : "Add Task To Backlog"}>
        <Fab
          sx={{
            position: "absolute",
            bottom: 0,
            bgcolor: errorArray[errorArray.length - 1] ? "red" : "primary.main",
            transform: `translate(-120%, 0%)`,
          }}
          onClick={() => {
            handleSubmit();
          }}
          size="large"
        >
          <DoneAllIcon />
        </Fab>
      </Tooltip>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Grid item xs={6} sx={{ width: "100%", height: "90vh" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", p: (t) => t.spacing(1) }}
          >
            {edit ? "Edit" : "Add"} Task
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: (t) => `${t.spacing(2)}`,
            }}
          >
            {activeView[activeForm]}
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            height: "100%",
            p: (t) => t.spacing(1),
            maxHeight: "90vh",
            overflowY: "scroll",
          }}
        >
          <Box sx={{ width: "100%", p: (t) => `${t.spacing(1)}` }}>
            <ItemView
              col={col}
              tasks={tasks}
              client={client}
              display={true}
              setTasks={setTasks}
              parent={"Item Form"}
              task={{
                ...task,
                ...form,
                columnTitle: col.title,
                images,
                attachments: attachments,
                title: form.title ? form.title : "Title here...",
                description: form.description ? form.description : "...",
                checklist: checklist,
              }}
            ></ItemView>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

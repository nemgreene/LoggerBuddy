import { Button, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { Container, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { colors } from "../../../Utility";
import ColorSelect from "../../../ColorSelect";
import { grey } from "@mui/material/colors";

export default function AddColumn({
  client,
  params: { trackedStream },
  setColumns,
  handleClose,
  edit,
  col,
}) {
  const [formData, changeFormData] = useState({
    name: edit ? col.title : "",
    color: edit ? col.color : "",
  });
  const handleChange = ({ target }) => {
    changeFormData((p) => ({ ...p, [target.name]: target.value }));
  };

  const submitColumn = async () => {
    if (!formData.name) {
      client.modalHandler(400, "Please Enter Column Name");
      changeFormData((p) => ({ ...p, name: false }));
      return;
    }
    if (!formData.color) {
      client.modalHandler(400, "Please Choose Color");
      return;
    }

    let res;
    if (edit) {
      res = await client.editColumn(trackedStream, col.id, formData);
    } else {
      res = await client.addColumn(trackedStream, formData);
    }
    if (res.status === 200) {
      changeFormData({ name: "", color: "" });
      handleClose();
      return setColumns(res.data);
    }
    client.modalHandler(400, "Sorry, something went wrong...");
  };

  return (
    <Box
      sx={{
        width: "30vw",
        minWidth: "300px",
        height: "100%",
        padding: (theme) => `${theme.spacing(5)} 7px ${theme.spacing(1)} 7px `,
        borderRadius: "20px",
        bgcolor: `${formData.color ? formData.color : grey[900]}`,
      }}
    >
      <Grid
        container
        sx={{
          borderRadius: "20px",
          padding: "0px",
          width: "100%",
          padding: (theme) => `${theme.spacing(2)}`,
          bgcolor: (theme) => theme.palette.background.paper,
        }}
      >
        <Grid
          item
          xs={12}
          container
          justifyContent={"center"}
          sx={{ padding: "0px" }}
        >
          <FormControl sx={{ width: "80%" }}>
            <TextField
              margin="normal"
              error={formData.name === false}
              id="outlined-basic"
              label="New Column Name"
              variant="outlined"
              value={formData.name ? formData.name : ""}
              name="name"
              onInput={(e) => {
                handleChange(e);
              }}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          container
          sx={{
            justifyContent: "center",
            paddingTop: (theme) => theme.spacing(3),
          }}
        >
          <Grid item xs={12} container justifyContent={"center"}>
            <FormLabel>Column Color:</FormLabel>
          </Grid>
          <ColorSelect
            activeColor={formData.color}
            changeColor={(color) => {
              changeFormData((p) => ({ ...p, color }));
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            paddingTop: (theme) => theme.spacing(3),
            paddingBottom: (theme) => theme.spacing(1),
          }}
        >
          <Button
            fullWidth
            variant={"contained"}
            onClick={() => {
              submitColumn();
            }}
            sx={{
              bgcolor: formData.color
                ? formData.color
                : (theme) => theme.palette.primary.main,
              "&:hover": {
                backgroundColor: formData.color
                  ? formData.color
                  : (theme) => theme.palette.primary.main,
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

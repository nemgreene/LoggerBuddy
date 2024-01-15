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

export default function AddScrum({
  client,
  params: { trackedStream },
  streamData,
  loadScrumBoard,
  setScrum,
  handleClose,
}) {
  const createScrum = async () => {
    console.log(trackedStream);
    const res = await client.addScrum(trackedStream);
    console.log(res);
    if (res.status === 200) {
      setScrum(true);
      loadScrumBoard();
      handleClose();
      return;
    }
    client.modalHandler("Sorry, error adding scrum...");
    client.logoutHandler();
    client.redirectHandler("/");
  };

  return (
    <Box>
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
        <Typography
          variant="h6"
          sx={{ textAlign: "center", width: "100%", mt: (t) => t.spacing(2) }}
        >
          No scrum found for {streamData.streamName}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.5,
            textAlign: "center",
            width: "100%",
            mb: (t) => t.spacing(2),
          }}
        >
          Create Now?
        </Typography>
        <Button
          onClick={createScrum}
          sx={{ m: (t) => t.spacing(1), p: (t) => t.spacing(2) }}
          fullWidth
          variant="contained"
        >
          Create Scrum
        </Button>
        <Button
          sx={{ m: (t) => t.spacing(1), p: (t) => t.spacing(2) }}
          fullWidth
          onClick={() => {
            client.redirectHandler("/");
          }}
          color="secondary"
          variant="contained"
        >
          Back
        </Button>
      </Grid>
    </Box>
  );
}

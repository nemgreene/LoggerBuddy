import { Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { GridRow } from "../../../../Utility";

export default function ItemFormHome({ edit, form, formError, handleChange }) {
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{ p: (t) => t.spacing(2), mb: (t) => t.spacing(2) }}
          >
            <Typography variant="h4">{edit ? "Edit" : "Add"} Item</Typography>
          </Grid>

          <GridRow item xs={12} container>
            <TextField
              sx={{ width: "100%" }}
              margin="normal"
              error={formError.title === false}
              id="outlined-basic"
              label="Title"
              variant="outlined"
              value={form.title}
              name="title"
              onInput={handleChange}
              // onFocus={() => {
              //   handleFocus("h1");
              // }}
            />
            <TextField
              sx={{ width: "100%" }}
              multiline
              margin="normal"
              error={formError.description === false}
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={form.description}
              name="description"
              onInput={handleChange}
              rows={3}
              // onFocus={() => {
              //   handleFocus("h1");
              // }}
            />
          </GridRow>
        </Grid>

        {/* <EditItemView /> */}
      </CardContent>
    </Card>
  );
}

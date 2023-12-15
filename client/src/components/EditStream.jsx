import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Card, CardContent } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import StreamLinksTable from "./StreamLinksTable";
import moment from "moment";

export default function EditStream({ client, editPost }) {
  const [formData, changeFormData] = useState(editPost);
  const [formErrors, changeFormErrors] = useState({});
  const [links, changeLinks] = useState(editPost.stream.links);
  const [editIndex, changeEditIndex] = useState();
  const [dateCreated, changeDate] = useState(
    moment(editPost.stream.dateCreated)
  );

  const handleChange = (e, key, toggle = false) => {
    changeFormData((p) => ({ ...p, [key]: e.target.value }));
  };

  const submitPost = async () => {
    const err = {};

    const optional = "h2 cut __v";

    Object.keys(formData).forEach((v) => {
      if (optional.includes(v)) {
        return;
      }
      if (!formData[v]) {
        err[v] = false;
      }
    });
    if (!isNaN(editIndex)) {
      err.editIndex = false;
    }
    changeFormErrors(err);
    if (JSON.stringify(err).includes("false")) {
      client.modalHandler(400, "Accept changes before Submitting");
      return;
    }
    // console.log(formData, links);

    // //passed checks, submit

    const res = await client.updateStream({
      ...editPost.stream,
      streamDescription: formData.body,
      dateCreated: dateCreated.format(),
      links,
    });
  };

  return (
    <Box>
      {/* New Post Field */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Container>
          <Card>
            <CardContent>
              <Grid>
                <TextField
                  margin="normal"
                  value={formData.body}
                  error={formErrors.body === false}
                  id="outlined-basic"
                  label="Stream Description"
                  fullWidth
                  rows={3}
                  variant="outlined"
                  multiline
                  onInput={(e) => {
                    handleChange(e, "body");
                  }}
                  // onFocus={() => {
                  // handleFocus("body");
                  // }}
                />
              </Grid>
              <DatePicker
                sx={{ margin: "10px 0px" }}
                label="Date Created"
                value={dateCreated}
                onChange={(newValue) => changeDate(newValue)}
              />
              <Grid>
                <StreamLinksTable
                  links={links}
                  changeLinks={changeLinks}
                  editIndex={editIndex}
                  changeEditIndex={changeEditIndex}
                />
              </Grid>
              <Grid>
                <Button
                  sx={{ margin: "10px 0px" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    submitPost();
                  }}
                >
                  Submit Edit
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </LocalizationProvider>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import PostCard from "./PostCard";
import { Box, Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import DragAndDrop from "./DragAndDrop";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PostForm from "./PostForm";

import StreamLinksTable from "./StreamLinksTable";
import moment from "moment";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AdminDashboard({ client, streamHeaders, loadStreams }) {
  const [images, changeImages] = useState([]);
  const [formData, changeFormData] = useState({
    h1: "",
    h2: "",
    body: "",
    links: [],
    streamName: "",
    streamId: "-1",
    cut: "",
  });
  const [formErrors, changeFormErrors] = useState({});
  const [streamForm, changeStreamForm] = useState({
    streamName: "",
    streamDescription: "",
    color: "",
  });
  const [links, changeLinks] = useState([]);
  const [editIndex, changeEditIndex] = useState();

  useEffect(() => {
    generateColor();
  }, []);

  const generateColor = () => {
    changeStreamForm((p) => ({
      ...p,
      color: `#${Math.random().toString(16).substr(-6)}`,
    }));
  };

  const handleChange = (e, key, toggle = false) => {
    changeFormErrors((p) => ({ ...p, [key]: "" }));
    if (!toggle) {
      changeFormData((p) => ({ ...p, [key]: e.target.value }));
    } else {
      changeStreamForm((p) => ({ ...p, [key]: e.target.value }));
    }
  };

  const handleStreamChange = (e) => {
    if (e.target.value === "-1") {
      return;
    }
    if (e.target.value === "add") {
      changeFormData((p) => ({
        ...p,
        streamId: e.target.value,
      }));
    } else {
      const streamHeader = streamHeaders.filter(
        (v) => v.streamId == e.target.value
      )[0];
      changeFormData((p) => ({
        ...p,
        streamId: e.target.value,
        streamName: streamHeader.streamName,
        color: streamHeader.color,
      }));
      changeFormErrors((p) => ({
        ...p,
        streamId: true,
      }));
    }
  };

  const submitStream = async () => {
    const skip = "streamId";
    //dispatch to make a new stream
    const err = {};
    Object.keys(streamForm).forEach((v) => {
      if (!streamForm[v] && !skip.includes(v)) {
        err[v] = false;
      }
    });

    if (!isNaN(editIndex)) {
      client.modalHandler(400, "Must complete changes to link");
      return;
    }

    if (JSON.stringify(err).includes("false")) {
      client.modalHandler(400, "Please fill out required fields");
      changeFormErrors(err);
      return;
    }

    const { data } = await client.newStream({ ...streamForm, links });
    if (data) {
      changeFormData((p) => ({
        ...p,
        streamId: data.streamId,
        streamName: data.streamName,
        color: data.color,
      }));
      changeStreamForm({
        streamName: "",
        streamId: "",
        color: `#${Math.random().toString(16).substr(-6)}`,
        streamDescription: "",
      });
      changeLinks([]);
      loadStreams();
    }
  };

  const submitPost = async () => {
    const err = {};

    if (!isNaN(editIndex)) {
      client.modalHandler(400, "Must complete changes to link");
    }
    const optional = "h2 cut";

    Object.keys(formData).forEach((v) => {
      if (optional.includes(v)) {
        return;
      }
      if (!formData[v]) {
        err[v] = false;
      }
    });

    if (formData.streamId == "-1") {
      err.streamId = false;
    }
    changeFormErrors(err);
    if (JSON.stringify(err).includes("false")) {
      return;
    }
    //passed checks, submit

    const res = await client.newPost({ ...formData, images });
    client.modalHandler(200, "Post Created");
    changeFormData({
      h1: "",
      h2: "",
      body: "",
      links: [],
      streamName: "",
      streamId: "-1",
      cut: "",
    });
    changeImages([]);

    //
    // changeFormData(checked);
  };

  // { name: "Bamboo Scripter", streamId: 0, posts: [], color: yellow[500] },
  const handlePaste = (e) => {
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = new Buffer.from(reader.result).toString("base64");
        changeImages((p) => (p ? [...p, binaryStr] : [binaryStr]));
      };
      reader.readAsArrayBuffer(fileObject);
    }
  };

  return (
    <div
      onPaste={(e) => {
        handlePaste(e);
      }}
    >
      <Box style={{ height: "100vh" }}>
        <Grid container alignContent={"center"} height={"100%"}>
          <Grid
            className="Parens"
            item
            xs={12}
            lg={6}
            container
            alignItems={"center"}
            justifyContent={"center"}
            style={{ height: "fit-content", height: "100%" }}
          >
            <Grid item sx={{ width: "90%" }}>
              {formData.streamId === "add" ? (
                <Box>
                  <Container>
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          Add Stream
                        </Typography>
                        <Grid container alignItems={"center"}>
                          <Grid item xs={3}>
                            <TextField
                              margin="normal"
                              error={formErrors.streamName === false}
                              fullWidth
                              id="outlined-basic"
                              label="Stream Name"
                              variant="outlined"
                              value={streamForm.streamName}
                              onInput={(e) => {
                                handleChange(e, "streamName", true);
                              }}
                              //   onFocus={() => {
                              //     handleFocus("streamName", true);
                              //   }}
                            />
                          </Grid>

                          <Grid item xs={6}>
                            <CardHeader
                              avatar={
                                <Avatar
                                  onClick={() => {
                                    generateColor();
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    bgcolor: streamForm["color"]
                                      ? streamForm.color
                                      : "red",
                                  }}
                                  aria-label="recipe"
                                >
                                  {streamForm["streamName"]
                                    ? streamForm.streamName[0]
                                    : "S"}
                                </Avatar>
                              }

                              // title={postObj.h1}
                              // subheader={`Posted: ${
                              //   postObj["datePosted"]
                              //     ? postObj.datePosted.toDateString()
                              //     : new Date().toDateString()
                              // }`}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              margin="normal"
                              value={streamForm.streamDescription}
                              id="outlined-basic"
                              label="Stream Description"
                              fullWidth
                              rows={3}
                              error={formErrors.streamDescription === false}
                              variant="outlined"
                              multiline
                              onInput={(e) => {
                                handleChange(e, "streamDescription", true);
                              }}
                              //   onFocus={() => {
                              //     handleFocus("streamDescription", true);
                              //   }}
                            />
                          </Grid>
                          <Grid>
                            <StreamLinksTable
                              links={links}
                              changeLinks={changeLinks}
                              editIndex={editIndex}
                              changeEditIndex={changeEditIndex}
                            />
                          </Grid>
                          <Grid item xs={9}></Grid>
                          <Grid item xs={3}>
                            <Button
                              sx={{ margin: "10px 0px" }}
                              variant="outlined"
                              fullWidth
                              onClick={() => {
                                submitStream();
                              }}
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Container>
                </Box>
              ) : (
                <PostForm
                  client={client}
                  images={images}
                  changeImages={changeImages}
                  formData={formData}
                  formErrors={formErrors}
                  handleChange={handleChange}
                  handleStreamChange={handleStreamChange}
                  streamHeaders={streamHeaders}
                  submitPost={submitPost}
                />
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={6}
            container
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ display: { xs: "none", lg: "flex" } }}
          >
            <Container style={{ width: "90%" }}>
              <Grid item xs={12}></Grid>
              {/* New stream field */}

              <PostCard
                postObj={{
                  ...formData,
                  h1: formData.h1 ? formData.h1 : "Header",
                  body: formData.body ? formData.body : "Body",
                  cut: formData.cut ? formData.cut : "Cut",
                  images: images,
                }}
              />
              <Button
                sx={{ padding: 2 }}
                variant="contained"
                fullWidth
                onClick={() => {
                  changeFormData({
                    h1: "",
                    h2: "",
                    body: "",
                    links: [],
                    streamName: "",
                    streamId: "-1",
                    cut: "",
                  });
                  changeImages();
                  client.redirect("/");
                }}
              >
                Back to Home
              </Button>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

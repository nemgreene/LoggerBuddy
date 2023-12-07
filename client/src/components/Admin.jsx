import React, { useEffect, useState } from "react";

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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AdminDashboard({ client }) {
  const [images, changeImages] = useState();
  const [streamHeaders, changeStreamHeaders] = useState([]);
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
    streamId: "",
    streamDescription: "",
    color: "",
    posts: [],
  });

  const loadData = async () => {
    const dbSHeaders = await client.getStreamHeaders();
    // console.log(dbSHeaders);
    changeStreamHeaders(dbSHeaders.data ? dbSHeaders.data : []);
  };

  useEffect(() => {
    generateColor();
    loadData();
  }, []);

  const generateColor = () => {
    changeStreamForm((p) => ({
      ...p,
      color: `#${Math.random().toString(16).substr(-6)}`,
    }));
  };

  const handleChange = (e, key, toggle = false) => {
    if (!toggle) {
      changeFormData((p) => ({ ...p, [key]: e.target.value }));
    } else {
      changeStreamForm((p) => ({ ...p, [key]: e.target.value }));
    }
  };

  const handleStreamChange = (e) => {
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
      console.log(e.target.value);
      changeFormErrors((p) => ({
        ...p,
        streamId: true,
      }));
    }
  };

  const handleFocus = (key, toggle) => {
    if (!toggle) {
      changeFormData((p) => ({ ...p, [key]: "" }));
    } else {
      changeStreamForm((p) => ({ ...p, [key]: "" }));
    }
  };

  const submitStream = async () => {
    //dispatch to make a new stream
    const { data } = await client.newStream(streamForm);
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

    loadData();
  };

  const submitPost = async () => {
    const err = {};

    const optional = "h2 cut";

    Object.keys(formData).forEach((v) => {
      console.log(v);
      if (optional.includes(v)) {
        return;
      }
      if (formData[v]) {
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
      // const file = {
      //   getRawFile: () => fileObject,
      //   name: fileObject.name,
      //   size: fileObject.size,
      //   uid: guid(),
      //   status: 2,
      //   progress: 0,
      // };

      // const filesState = this.state.files.map((f) => ({ ...f }));
      // filesState.push(file);

      // this.setState({ files: filesState });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div
        onPaste={(e) => {
          handlePaste(e);
        }}
      >
        <Box>
          {/* Display Card */}
          <Container>
            <Grid item xs={12}></Grid>
            <PostCard
              postObj={{
                ...formData,
                h1: formData.h1 ? formData.h1 : "Header",
                body: formData.body ? formData.body : "Body",
                cut: formData.cut ? formData.cut : "Cut",
                images: images,
              }}
            />
          </Container>

          {/* New stream field */}
          {formData.streamId === "add" ? (
            <Container sx={{ paddingBottom: "10px" }}>
              <Card>
                <CardContent>
                  <Typography
                    sx={{ padding: "20px" }}
                    variant="h5"
                    component="div"
                  >
                    Add Stream
                  </Typography>
                  <Grid container alignItems={"center"}>
                    <Grid item xs={3}>
                      <TextField
                        margin="normal"
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
          ) : null}

          {/* Uplaod Images */}
          <Container>
            <Card>
              <CardContent>
                <DragAndDrop
                  client={client}
                  images={images}
                  changeImages={changeImages}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ marginTop: 2 }}>
                    <Button
                      sx={{ padding: 2 }}
                      variant="contained"
                      onClick={() => {
                        changeImages();
                      }}
                      color="error"
                      fullWidth
                    >
                      Delete Images
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Container>

          {/* New Post Field */}
          <Container>
            <Card>
              <CardContent>
                <Grid container item xs={12}>
                  <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      error={formErrors.h1 === false}
                      id="outlined-basic"
                      label="Header"
                      variant="outlined"
                      value={formData.h1}
                      onInput={(e) => {
                        handleChange(e, "h1");
                      }}
                      // onFocus={() => {
                      //   handleFocus("h1");
                      // }}
                    />
                    <TextField
                      margin="normal"
                      error={formErrors.h2 === false}
                      value={formData.h2}
                      id="outlined-basic"
                      label="SubHeader (optional)"
                      variant="outlined"
                      onInput={(e) => {
                        handleChange(e, "h2");
                      }}
                      // onFocus={() => {
                      //   handleFocus("h2");
                      // }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="standard"
                        htmlFor="uncontrolled-native"
                      >
                        Stream
                      </InputLabel>
                      <NativeSelect
                        onChange={handleStreamChange}
                        value={formData.streamId}
                        error={formErrors.streamId === false}
                        inputProps={{
                          name: "stream",
                          id: "uncontrolled-native",
                        }}
                      >
                        <option value={"-1"}>Choose Stream</option>
                        {streamHeaders.map((v, k) => (
                          <option value={v.streamId} key={k}>
                            {v.streamName}
                          </option>
                        ))}
                        <option value={"add"}>+ New Stream</option>
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid>
                  <TextField
                    margin="normal"
                    value={formData.body}
                    error={formErrors.body === false}
                    id="outlined-basic"
                    label="Body"
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
                  <TextField
                    margin="normal"
                    error={formErrors.cut === false}
                    value={formData.cut}
                    id="outlined-basic"
                    label="Under the Cut (optional)"
                    fullWidth
                    rows={3}
                    variant="outlined"
                    multiline
                    onInput={(e) => {
                      handleChange(e, "cut");
                    }}
                    // onFocus={() => {
                    // handleFocus("cut");
                    // }}
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
                    Post
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

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
    streamId: "",
    streamDescription: "",
    color: "",
    posts: [],
  });

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

    loadStreams();
  };

  const submitPost = async () => {
    const err = {};

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
    console.log(err);
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
            xs={6}
            container
            alignItems={"center"}
            justifyContent={"center"}
            style={{ height: "fit-content", width: "100%", height: "100%" }}
          >
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
          </Grid>
          <Grid
            item
            xs={6}
            container
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Container style={{ width: "80%" }}>
              <Grid item xs={12}></Grid>
              {/* New stream field */}
              {formData.streamId === "add" ? (
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
              ) : null}

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

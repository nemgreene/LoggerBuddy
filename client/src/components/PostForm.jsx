import React from "react";
import { Box, Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Card, CardContent } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import DragAndDrop from "./DragAndDrop";
import Pictures from "./Pictures";
import TagSelect from "./TagSelect";

export default function PostForm({
  client,
  images,
  changeImages,
  formData,
  formErrors,
  handleChange,
  handleStreamChange,
  streamHeaders,
  submitPost,
  edit,
  children,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {images && images[0] ? (
        <Container>
          <Card>
            <Pictures images={images} edit={edit} />
            <br />
            {images.length > 0 ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ marginTop: 2 }}>
                  <Button
                    sx={{ padding: 2 }}
                    variant="contained"
                    onClick={() => {
                      changeImages([]);
                    }}
                    color="error"
                    fullWidth
                  >
                    Delete Images
                  </Button>
                </Grid>
              </Grid>
            ) : null}
          </Card>
        </Container>
      ) : (
        <Container>
          <Card>
            <CardContent>
              <DragAndDrop
                client={client}
                images={images}
                changeImages={changeImages}
              />
              {images.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ marginTop: 2 }}>
                    <Button
                      sx={{ padding: 2 }}
                      variant="contained"
                      onClick={() => {
                        changeImages([]);
                      }}
                      color="error"
                      fullWidth
                    >
                      Delete Images
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
            </CardContent>
          </Card>
        </Container>
      )}

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
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
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
                    {!edit ? <option value={"-1"}>Choose Stream</option> : null}
                    {streamHeaders.map((v, k) => (
                      <option value={v.streamId} key={k}>
                        {v.streamName}
                      </option>
                    ))}
                    {!edit ? <option value={"add"}>+ New Stream</option> : null}
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
                {edit ? "Submit Edit" : "Post"}
              </Button>
              {children}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

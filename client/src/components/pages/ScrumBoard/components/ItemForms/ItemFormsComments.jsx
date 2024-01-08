import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ItemComments from "../ItemComments";
import { Box } from "@mui/system";
import Pictures from "../../../../Pictures";
import DragAndDrop from "../../../../DragAndDrop";
import { Buffer } from "buffer";

export default function ItemFormsComments({
  client,
  form,
  add,
  changeForm,
  formError,
  changeFormErrors,
  setTasks,
  task,
}) {
  const [commentForm, changeCommentForm] = useState({
    comment: "",
  });
  const [images, changeImages] = useState([]);
  const [toggle, setToggle] = useState(true);

  const handleSubmit = async () => {
    if (!commentForm.comment) {
      client.modalHandler(400, "Post body cannot be empty...");
      changeFormErrors((p) => ({ ...p, comment: false }));
      return;
    }
    if (add) {
      //make api call
      changeForm((p) => ({
        ...p,
        comments: [
          ...p.comments,
          images.length > 0
            ? { ...commentForm, date: new Date(), images }
            : { ...commentForm, date: new Date() },
        ],
      }));
      changeCommentForm({ comment: "" });
      changeImages([]);
    } else {
      console.log("submit from edit");
      const res = await client.taskUpdate(task.id, {
        ...task,
        comments: [
          ...task.comments,
          images.length > 0
            ? { ...commentForm, date: new Date(), images }
            : { ...commentForm, date: new Date() },
        ],
      });
      if (res.status === 200) {
        setTasks(res.data);
      }
    }
    //reset form
    changeCommentForm({ comment: "" });
    changeImages([]);
    setToggle(true);
  };

  const deleteImage = (id) => {
    let update = [...images];
    update = update.filter((_, i) => i != id);
    changeImages(update || []);
  };

  return (
    <Box
      onPaste={(e) => {
        if (e.clipboardData.files.length) {
          const fileObject = e.clipboardData.files[0];
          const reader = new FileReader();
          console.log("Pasting");

          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = () => {
            const binaryStr = new Buffer.from(reader.result).toString("base64");
            changeImages((p) => (p ? [...p, binaryStr] : [binaryStr]));
          };
          reader.readAsArrayBuffer(fileObject);
        }
      }}
    >
      {toggle && (
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                justifyContent: "center",
                m: (t) => t.spacing(1),
                textAlign: "center",
              }}
            >
              Comments
            </Typography>
            <ItemComments
              task={task}
              form={form}
              setTasks={setTasks}
              client={client}
              comments={add ? form.comments : task.comments}
              add={add}
              changeForm={changeForm}
            />
            <Button
              // onClick={handleSubmit}
              onClick={() => {
                setToggle(false);
              }}
              fullWidth
              variant="contained"
              sx={{ p: (t) => t.spacing(2) }}
            >
              <AddCircleIcon sx={{ mr: "10px" }} />
              Add Comment
            </Button>
          </CardContent>
        </Card>
      )}
      {!toggle && (
        <Card>
          <CardContent>
            {images.length > 0 && (
              <Pictures images={images} edit={deleteImage} />
            )}
            <DragAndDrop images={images} changeImages={changeImages} />
            <TextField
              margin="normal"
              value={commentForm.comment}
              id="outlined-basic"
              label="New Comment..."
              fullWidth
              rows={2}
              error={formError?.comment === false}
              variant="outlined"
              multiline
              name="comment"
              onInput={(e) => {
                changeFormErrors((p) => ({ ...p, comment: "" }));
                changeCommentForm((p) => ({ ...p, comment: e.target.value }));
              }}
            />
          </CardContent>
          <Grid container>
            <Grid item xs={6} sx={{ p: (t) => t.spacing(1) }}>
              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ p: (t) => t.spacing(1) }}
              >
                Comment
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ p: (t) => t.spacing(1) }}>
              <Button
                onClick={() => {
                  changeFormErrors((p) => ({ ...p, comment: "" }));
                  setToggle(true);
                  changeCommentForm({ comment: "" });
                  changeImages([]);
                  setToggle(true);
                }}
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ p: (t) => t.spacing(1) }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
}

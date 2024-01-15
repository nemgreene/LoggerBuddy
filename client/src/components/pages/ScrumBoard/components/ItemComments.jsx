import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pictures from "../../../Pictures";
import update from "immutability-helper";

export default function ItemComments({
  comments,
  add,
  display,
  changeForm,
  task,
  setTasks,
  client,
  form,
}) {
  const handleDelete = async (commentIndex) => {
    const up = update(
      [...comments].map((v, i) => ({ ...v, index: i })),
      {
        $splice: [[commentIndex, 1]],
      }
    );
    changeForm((p) => ({ ...p, comments: up }));
  };

  const deleteImage = async (imageIndex, commentIndex) => {
    const newImages = update(
      [...comments[commentIndex].images].map((v, i) => ({ ...v, index: i })),
      {
        $splice: [[imageIndex, 1]],
      }
    );
    const up = update(
      [...comments].map((v, i) => ({ ...v, index: i })),
      {
        $splice: [
          [commentIndex, 1],
          [
            commentIndex,
            0,
            {
              ...comments[commentIndex],
              images: newImages.length > 0 ? newImages : undefined,
            },
          ],
        ],
      }
    );
    changeForm((p) => ({ ...p, comments: up }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {comments.map((v, i) => (
        <Card
          key={i}
          sx={{ m: (t) => t.spacing(1), p: (t) => `0px ${t.spacing(1)}` }}
        >
          <CardContent>
            <Box sx={{ width: "100%", pb: (t) => t.spacing(1) }}>
              {v.images?.length > 0 && (
                <Pictures
                  images={v.images}
                  edit={
                    add || display
                      ? undefined
                      : (imageId) => deleteImage(imageId, i)
                  }
                />
              )}
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>
                  {new Date(v.date).toDateString() || new Date().toDateString()}
                </Typography>
              </Box>
              {!display && (
                <IconButton
                  sx={{ mr: (t) => t.spacing(1) }}
                  onClick={() => {
                    handleDelete(i);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            {v.comment}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

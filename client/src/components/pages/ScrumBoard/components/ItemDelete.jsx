import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function ItemDelete({
  task,
  col,
  client,
  setTasks,
  handleClose,
}) {
  const handleDelete = async () => {
    const res = await client.deleteItem(task.id);
    if (res.status === 200) {
      setTasks(res.data.tasks);
      handleClose();
      return;
    }
    client.modalHandler(400, "Could not delete task...");
  };

  return (
    <Card sx={{ width: "25vw", minWidth: "250px" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", m: (t) => t.spacing(2) }}
        >
          Confirm Item Delete?
        </Typography>
        <Box sx={{ m: (t) => t.spacing(1) }}>
          <Typography variant="body1">
            Item: {task.title}
            <span style={{ opacity: 0.5 }}> #{task.issueNumber}</span>
          </Typography>
          <Typography variant="body2">In: {col.title}</Typography>
        </Box>
        <Button
          sx={{ m: (t) => `${t.spacing(3)} 0px 0px 0px` }}
          fullWidth
          color="error"
          variant="contained"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

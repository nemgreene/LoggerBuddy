import { Card, CardContent } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function ItemComments({ comments }) {
  return (
    <Box sx={{ width: "100%" }}>
      {comments.map((v, i) => (
        <Card
          key={i}
          sx={{ m: (t) => t.spacing(1), p: (t) => `0px ${t.spacing(1)}` }}
        >
          <CardContent>{v.content}</CardContent>
        </Card>
      ))}
    </Box>
  );
}

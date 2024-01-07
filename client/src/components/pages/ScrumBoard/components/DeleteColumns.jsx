import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
export default function DeleteColumns({
  col,
  client,
  setColumns,
  handleClose,
}) {
  const handleDelete = async () => {
    const res = await client.deleteColumns(col.id);
    if (res.status === 200) {
      setColumns(res.data.columns);
      handleClose();
    }
  };
  return (
    <Card>
      <CardContent>
        <Box sx={{ padding: (t) => t.spacing(2) }}>
          <Typography variant="h6">
            Confirm to delete "{col.title}" ?
          </Typography>
          <Typography variant="p1">
            This cannot be undone, tasks will be lost.{" "}
          </Typography>
        </Box>
        <Grid container sx={{ paddingTop: (t) => t.spacing(2) }}>
          <Grid item xs={6} sx={{ padding: (t) => t.spacing(1) }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ padding: (t) => t.spacing(1) }}>
            <Button fullWidth variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

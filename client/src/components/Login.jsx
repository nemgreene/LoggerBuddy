import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

export default function LoginComponent({ client }) {
  const [formValues, setFormValues] = useState({});
  const [flagged, setFlagged] = useState({});

  const handleChange = (e) => {
    setFormValues((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const handleFocus = (e) => {
    setFlagged((p) => ({ ...p, [e.target.name]: false }));
  };

  const handleSubmit = async (redirect = "/admin") => {
    const dict = ["password"];
    const flaggedObj = {};

    dict.forEach((v, i) => {
      if (!formValues[v]) {
        flaggedObj[v] = true;
        flaggedObj.msg = "Password required";
      }
    });
    setFlagged(flaggedObj);
    if (Object.keys(flaggedObj).length !== 0) {
      return;
    }
    const res = await client.login(formValues);
    if (res.status === 200) {
      client.credentialsManager(res.data.sessionCookie, res.data._id);
      return client.redirect(redirect);
    }
  };

  useEffect(() => {
    if (flagged.msg) {
      setFlagged((p) => ({ ...p, msg: null }));
      return client.modalHandler(400, flagged.msg);
    }
  }, [flagged.msg, client]);
  return (
    <Box>
      <Grid
        container
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item lg={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ mb: 3, mt: 1 }} variant="h4" component="div">
                Admin Login
              </Typography>

              <TextField
                onFocus={handleFocus}
                onChange={handleChange}
                sx={{ width: 1, mb: 1 }}
                required
                label="Password"
                name="password"
                error={flagged.password}
                type="password"
              />
              <CardActions sx={{ pl: 0, pr: 0 }}>
                <Button
                  onClick={() => handleSubmit("/admin")}
                  sx={{ width: 1, p: 1.5 }}
                  variant="contained"
                  color="primary"
                >
                  Admin
                </Button>
                <Button
                  onClick={() => handleSubmit("/")}
                  sx={{ width: 1, p: 1.5 }}
                  variant="contained"
                  color="primary"
                >
                  Dash
                </Button>
              </CardActions>
              <CardActions sx={{ pl: 0, pr: 0 }}>
                <Button
                  onClick={() => client.redirect("/")}
                  sx={{ width: 1, p: 1.5 }}
                  variant="contained"
                  color="secondary"
                >
                  Back
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

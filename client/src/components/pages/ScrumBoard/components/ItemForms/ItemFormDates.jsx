import {
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ItemComments from "../ItemComments";
import { Box, Container } from "@mui/system";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import ItemDates from "../ItemDates";
import { FormSkeleton, colors } from "../../../../Utility";

export default function ItemFormsDates({
  client,
  form,
  changeForm,
  formError,
  changeFormErrors,
}) {
  const [caption, changeCaption] = useState({
    caption: "",
    date: moment(),
  });
  const [toggle, setToggle] = useState(true);

  const handleSubmit = async () => {
    if (!caption.caption) {
      client.modalHandler(400, "Date caption cannot be empty...");
      changeFormErrors((p) => ({ ...p, caption: false }));
      return;
    }
    if (!caption.date) {
      client.modalHandler(400, "Date cannot be empty...");
      changeFormErrors((p) => ({ ...p, date: false }));
      return;
    }
    //make api call
    // return;
    changeForm((p) => ({
      ...p,
      dates: [
        ...p.dates,
        {
          ...caption,
          date: new Date(caption.date),
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ],
    }));
    changeCaption({
      caption: "",
      date: moment(),
    });
    setToggle(true);
  };

  {
  }
  return (
    <Box sx={{ width: "100%" }}>
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
              Dates
            </Typography>
            {form.dates.length > 0 ? (
              <Box sx={{ mb: (t) => t.spacing(3), mt: (t) => t.spacing(3) }}>
                <ItemDates
                  edit={true}
                  dates={form.dates}
                  changeForm={changeForm}
                />
              </Box>
            ) : (
              <FormSkeleton />
            )}
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
              Add Date
            </Button>
          </CardContent>
        </Card>
      )}
      {!toggle && (
        <Card>
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  p: (t) => t.spacing(1),
                }}
              >
                <TextField
                  value={caption.caption}
                  id="outlined-basic"
                  label="Date Caption..."
                  fullWidth
                  error={formError?.caption === false}
                  variant="outlined"
                  name="caption"
                  onInput={(e) => {
                    if (formError.caption === false) {
                      changeFormErrors((p) => ({ ...p, caption: "" }));
                    }
                    changeCaption((p) => ({ ...p, caption: e.target.value }));
                  }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  p: (t) => t.spacing(1),
                }}
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date"
                    value={caption.date}
                    onChange={(newValue) =>
                      changeCaption((p) => ({ ...p, date: newValue }))
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
          <Grid
            container
            sx={{
              p: (t) => `0px ${t.spacing(2)} ${t.spacing(2)} ${t.spacing(2)}`,
            }}
          >
            <Grid item xs={6} sx={{ p: (t) => t.spacing(1) }}>
              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ p: (t) => t.spacing(1) }}
              >
                Submit Date
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ p: (t) => t.spacing(1) }}>
              <Button
                onClick={() => {
                  changeFormErrors((p) => ({ ...p, caption: "" }));
                  setToggle(true);
                  changeCaption({ caption: "", date: moment() });
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

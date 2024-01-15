import { Chip, Tooltip, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import moment from "moment";
import React from "react";

export default function ItemDates({ dates, edit, changeForm }) {
  return (
    <Box sx={{ width: "100%" }}>
      {dates
        .sort((a, b) => moment(a.date).valueOf() > moment(b.date).valueOf())
        .map((v, i) => (
          <Tooltip key={i} title={v.caption}>
            <Chip
              variant="small"
              sx={{ bgcolor: v.color ? v.color : "auto" }}
              onDelete={
                edit
                  ? () =>
                      changeForm((p) => ({
                        ...p,
                        dates: p.dates.filter((_, fi) => i !== fi),
                      }))
                  : undefined
              }
              label={
                <Box
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      alignItems: "center",
                      maxWidth: "75px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.caption}
                  </Typography>
                  <Typography variant="caption" sx={{ whiteSpace: "pre-wrap" }}>
                    {` (${moment(v.date).format("DD/MM/YY")})`}
                  </Typography>
                </Box>
              }
            />
          </Tooltip>
        ))}
    </Box>
  );
}

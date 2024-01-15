import { Card, Box, Tooltip } from "@mui/material";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function ColumnAdd({ containerStyle, props }) {
  return (
    <Card style={{ ...containerStyle, margin: "0px 5px" }}>
      <Box
        sx={{
          height: "85vh",
          width: "100%",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          props.openModal({ name: "AddColumn" });
        }}
      >
        <Tooltip title="Add Column">
          <AddCircleIcon
            sx={{
              opacity: ".25",
              fontSize: 80,
            }}
          />
        </Tooltip>
      </Box>
    </Card>
  );
}

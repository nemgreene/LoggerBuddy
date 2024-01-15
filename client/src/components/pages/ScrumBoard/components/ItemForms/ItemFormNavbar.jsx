import React from "react";
import { ScrumItemIconDict } from "../../../../Utility";
import { Box } from "@mui/system";
import CircleIcon from "@mui/icons-material/Circle";
import { Fab } from "@mui/material";

export default function ItemFormNavbar({
  activeForm,
  activeArray,
  errorArray,
  changeActiveForm,
  editIndex,
  changeEditIndex,
}) {
  const itemStyle = {
    position: "absolute",
    color: "primary.dark.contrastText",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };
  return (
    <>
      {Object.keys(ScrumItemIconDict).map((v, i) => {
        return (
          <Box
            key={i}
            sx={{ ...itemStyle, transform: `translate(-120%, ${i * 120}%)` }}
          >
            {activeForm === v && <CircleIcon fontSize="7" sx={{ mr: "7px" }} />}
            <Fab
              sx={
                errorArray[i]
                  ? { bgcolor: "red" }
                  : {
                      bgcolor: activeArray[i]
                        ? "secondary.main"
                        : "primary.main",
                    }
              }
              onClick={() => {
                changeActiveForm(v);
              }}
              size="large"
            >
              {ScrumItemIconDict[v]("medium").icon}
            </Fab>
          </Box>
        );
      })}
    </>
  );
}

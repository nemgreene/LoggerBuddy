import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";

export default function TagSelect({ value, setValue, options, label }) {
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      id="controlled-demo"
      value={value}
      options={options || []}
      multiple
      freeSolo
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label || "Select Tags"}
          placeholder="Search tags..."
        />
      )}
    />
  );
}

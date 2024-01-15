import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";

export default function TagSelect({
  value,
  setValue,
  options = [],
  label,
  trackedStream,
}) {
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      id="controlled-demo"
      value={value}
      options={options || []}
      multiple
      freeSolo
      getOptionLabel={(option) => option.streamName}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => {
          return (
            <Chip
              variant="outlined"
              label={option.streamName}
              {...getTagProps({ index })}
            />
          );
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label || "Select Tags"}
          placeholder="Search tags..."
        />
      )}
    />
    // <Autocomplete
    //   value={value || null}
    //   defaultValue={[]}
    //   onChange={(event, newValue) => {
    //     setValue(newValue);
    //   }}
    //   renderTags={(value, getTagProps) =>
    //     value.map((option, index) => (
    //       <Chip variant="outlined" label={option} {...getTagProps({ index })} />
    //     ))
    //   }
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       variant="filled"
    //       label={label || "Select"}
    //       placeholder="Favorites"
    //     />
    //   )}
    // />
  );
}

import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { colors } from "../../../../Utility";
import update from "immutability-helper";

export default function ItemLabelSelect({ value, changeForm, options, label }) {
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      id="controlled-demo"
      value={value}
      options={options || []}
      multiple
      freeSolo
      onChange={(event, newValue) => {
        if (
          event.type === "keydown" &&
          typeof newValue[newValue.length - 1] === "string"
        ) {
          changeForm((p) => ({
            ...p,
            labels: [
              ...p.labels,
              {
                label: newValue[newValue.length - 1],
                color: colors[Math.floor(Math.random() * colors.length)],
              },
            ],
          }));
        } else changeForm((p) => ({ ...p, labels: newValue }));
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.label}
            sx={{ bgcolor: option.color }}
            {...getTagProps({ index })}
          />
        ))
      }
      //   getOptionLabel={(option) => option.label}
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

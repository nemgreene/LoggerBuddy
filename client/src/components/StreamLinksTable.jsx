import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { TextField, Typography, Grid, Tooltip } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { linkIcons } from "./Utility";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function StreamLinksTable({
  links,
  changeLinks,
  editIndex,
  changeEditIndex,
}) {
  const [editForm, changeEditForm] = useState({
    url: "",
    tooltip: "",
    icon: "git",
  });

  const [err, changeErr] = useState(false);

  const handleChange = (e, name) => {
    if (err) {
      changeErr(false);
    }
    changeEditForm((p) => ({ ...p, [name]: e.target.value }));
  };

  const submitLinkEdit = () => {
    if (!editForm.url) {
      changeErr(true);
      return;
    }
    changeErr(false);
    let ret = [...links];
    ret[editIndex] = { ...ret[editIndex], ...editForm };
    changeLinks(ret);
    changeEditIndex();
    changeEditForm({ url: "", tooltip: "", icon: "git" });
  };

  const LinkRow = ({ index }) => {
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <TableCell sx={{ width: "5%", maxWidth: "5%z" }}>
          <Grid container sx={{ width: "100%", justifyContent: "center" }}>
            <Grid item xs={6} container sx={{ justifyContent: "center" }}>
              <Tooltip title="Delete Link">
                <DeleteForeverIcon
                  onClick={() => {
                    changeLinks((p) => p.filter((v, i) => i !== index));
                  }}
                  sx={{ cursor: "pointer" }}
                  color="error"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} container sx={{ justifyContent: "center" }}>
              <Tooltip title="Edit Link">
                <EditIcon
                  onClick={() => {
                    if (!editIndex) {
                      changeEditIndex(index);
                      changeEditForm(links[index]);
                    } else {
                      submitLinkEdit();
                    }
                  }}
                  sx={{ cursor: "pointer" }}
                  color="primary"
                />
              </Tooltip>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell align="left">{links[index].url}</TableCell>
        <TableCell sx={{ width: "10%" }}>
          {links[index].icon ? linkIcons[links[index].icon] : ""}
        </TableCell>
        <TableCell>
          {links[index].tooltip ? links[index].tooltip : "No Tooltip"}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography whiteSpace={"noWrap"}>Stream Links</Typography>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link, index) =>
            editIndex === index ? (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ width: "5%" }}>
                  <Grid
                    container
                    sx={{ width: "100%", justifyContent: "center" }}
                  >
                    <Grid
                      item
                      xs={6}
                      container
                      sx={{ justifyContent: "center" }}
                    >
                      <Tooltip title="Delete Link">
                        <DeleteForeverIcon
                          onClick={() => {
                            changeErr(false);
                            changeLinks((p) => p.filter((v, i) => i !== index));
                          }}
                          sx={{ cursor: "pointer" }}
                          color="error"
                        />
                      </Tooltip>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      container
                      sx={{ justifyContent: "center" }}
                    >
                      <Tooltip title="Submit Changes">
                        <CheckBoxIcon
                          onClick={() => {
                            submitLinkEdit();
                          }}
                          sx={{ cursor: "pointer" }}
                          color="primary"
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <TextField
                    // autoFocus={true}
                    sx={{ width: "100%", margin: "0px" }}
                    margin="normal"
                    error={err}
                    id="outlined-basic"
                    label="Link"
                    variant="outlined"
                    value={editForm.url}
                    onInput={(e) => {
                      handleChange(e, "url");
                    }}
                    // onFocus={() => {
                    //   handleFocus("h1");
                    // }}
                  />
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={editForm.icon}
                    onChange={(e) => handleChange(e, "icon")}
                  >
                    {Object.keys(linkIcons).map((iconName, key) => (
                      <MenuItem
                        value={iconName}
                        key={key}
                        sx={{ justifyContent: "center" }}
                      >
                        {linkIcons[iconName]}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="left">
                  <TextField
                    // autoFocus={true}
                    sx={{ width: "100%", margin: "0px" }}
                    margin="normal"
                    error={err}
                    id="outlined-basic"
                    label="Tooltip"
                    variant="outlined"
                    value={editForm.tooltip}
                    onInput={(e) => {
                      handleChange(e, "tooltip");
                    }}
                    // onFocus={() => {
                    //   handleFocus("h1");
                    // }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <LinkRow key={index} index={index} />
            )
          )}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell>
              <AddBoxIcon
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!isNaN(editIndex)) {
                    console.log(editIndex);
                    // if (!isNaN(editIndex)) {
                    changeLinks((p) => [...p, {}]);
                    changeEditIndex(links.length);
                  }
                  // }
                }}
              />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

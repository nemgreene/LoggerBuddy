import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TaskCard from "./SortableItem";

import MultipleContainers from "./MultipleContainers";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import AddColumn from "./components/AddColumn";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

export default function ScrumBoard({ client, credentials }) {
  const [open, setOpen] = useState(false);
  const handleOpen = (modal) => setOpen(modal);
  const handleClose = () => setOpen(false);

  const [columns, setColumns] = useState([]);
  const [items, setItems] = useState([]);

  const params = useParams();

  const modalObj = {
    AddColumn: (
      <AddColumn
        client={client}
        params={params}
        setColumns={setColumns}
        columns={columns}
        handleClose={handleClose}
      />
    ),
    EditColumn: (
      <AddColumn
        edit={true}
        col={open?.data}
        client={client}
        params={params}
        setColumns={setColumns}
        columns={columns}
        handleClose={handleClose}
      />
    ),
  };
  const loadScrumBoard = async () => {
    setColumns([]);
    setItems([]);
    const { data } = await client.getScrumBoard(params.trackedStream);
    setColumns(data.columns);
    setItems(data.items);
  };

  useEffect(() => {
    loadScrumBoard();
  }, []);

  return (
    <div>
      <Modal
        open={open ? true : false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{open ? modalObj[open.name] : null}</Box>
      </Modal>

      <DndProvider backend={HTML5Backend}>
        <MultipleContainers
          credentials={credentials}
          openModal={handleOpen}
          columns={columns}
          items={items}
          setColumns={setColumns}
          setItems={setItems}
          client={client}
          trackedStream={params.trackedStream}
        />
      </DndProvider>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import MultipleContainers from "./MultipleContainers";
import AddColumn from "./components/AddColumn";
import DeleteColumns from "./components/DeleteColumns";
import ItemView from "./components/ItemView";
import ItemForm from "./components/ItemForm";
import ItemDelete from "./components/ItemDelete";
import ScrumNav from "./ScrumNav";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
};

export default function ScrumBoard({ client, credentials }) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const handleOpen = (modal) => setOpen(modal);
  const handleClose = () => setOpen(false);

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [streamData, changeStreamData] = useState({});

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
    DeleteColumn: (
      <DeleteColumns
        client={client}
        col={open?.data}
        setColumns={setColumns}
        handleClose={handleClose}
      />
    ),

    AddItem: (
      <ItemForm
        add={true}
        task={{ checklist: [] }}
        setTasks={setTasks}
        col={{ ...open.col, trackedStream: params.trackedStream }}
        client={client}
        tasks={tasks}
        setColumns={setColumns}
        handleClose={handleClose}
      />
    ),
    EditItem: (
      <ItemForm
        setTasks={setTasks}
        edit={open.task}
        col={{ ...open.col, trackedStream: params.trackedStream }}
        client={client}
        tasks={tasks}
        task={tasks.filter((v) => v.id === open?.task?.id)[0]}
        setColumns={setColumns}
        handleClose={handleClose}
      />
    ),
    ViewItem: (
      <ItemView
        parent={"ScrumBoard"}
        tasks={tasks}
        setTasks={setTasks}
        client={client}
        task={tasks.filter((v) => v.id === open?.task?.id)[0]}
        setColumns={setColumns}
        handleClose={handleClose}
      />
    ),
    DeleteItem: (
      <ItemDelete
        client={client}
        task={tasks.filter((v) => v.id === open?.task?.id)[0]}
        setTasks={setTasks}
        handleClose={handleClose}
        col={{ ...open.col, trackedStream: params.trackedStream }}
      />
    ),
  };
  const loadScrumBoard = async () => {
    setColumns([]);
    setTasks([]);
    const { data } = await client.getScrumBoard(params.trackedStream);
    setColumns(data.columns);
    setTasks(data.tasks);
    changeStreamData({ streamName: data.streamName });
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
        <Box sx={style}>{open.name ? modalObj[open.name] : null}</Box>
      </Modal>
      <ScrumNav streamData={streamData} client={client} />
      <DndProvider backend={HTML5Backend}>
        <MultipleContainers
          credentials={credentials}
          openModal={handleOpen}
          columns={columns}
          tasks={tasks}
          setColumns={setColumns}
          setTasks={setTasks}
          client={client}
          trackedStream={params.trackedStream}
        />
      </DndProvider>
    </div>
  );
}

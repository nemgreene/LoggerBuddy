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
import AddScrum from "./components/AddScrum";

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
  const params = useParams();
  const handleOpen = (modal) => setOpen(modal);
  const handleClose = () => setOpen(false);
  const [scrum, setScrum] = useState(false);

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [streamData, changeStreamData] = useState({});
  const [possibleLabels, setPossibleLabels] = useState([]);

  const loadScrumBoard = async () => {
    setColumns([]);
    setTasks([]);
    const res = await client.getScrumBoard(params.trackedStream);
    if (res.status === 200) {
      const { data } = res;
      setColumns(data.columns);
      setTasks(data.tasks);
      setPossibleLabels(data.labels);
      changeStreamData({ streamName: data.streamName });
      setScrum(true);
      return;
    }
    if (res.status == 201) {
      changeStreamData({ streamName: res.data.streamName });
      setOpen({ name: "AddScrum" });
    }
  };

  const modalObj = {
    AddScrum: (
      <AddScrum
        client={client}
        params={params}
        handleClose={handleClose}
        loadScrumBoard={loadScrumBoard}
        streamData={streamData}
        setScrum={setScrum}
      />
    ),
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
        possibleLabels={possibleLabels}
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
        possibleLabels={possibleLabels}
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
        display={true}
        parent={"ScrumBoard"}
        tasks={tasks}
        setTasks={setTasks}
        client={client}
        open={open}
        col={{ ...open.col, trackedStream: params.trackedStream }}
        task={{ ...tasks.filter((v) => v.id === open?.task?.id)[0] }}
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
  useEffect(() => {
    loadScrumBoard();
  }, []);

  return (
    <div>
      <Modal
        open={open ? true : false}
        onClose={
          scrum
            ? handleClose
            : () => client.modalHandler(400, "No Scrum found for this project")
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{open.name ? modalObj[open.name] : null}</Box>
      </Modal>
      {scrum && (
        <>
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
        </>
      )}
    </div>
  );
}

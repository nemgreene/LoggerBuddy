import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PostCard from "./PostCard";
import Modal from "@mui/material/Modal";
import { sortObj } from "./Utility";
import EditPost from "./EditPost";
import EditStream from "./EditStream";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function StreamTable({
  streamData,
  trackedStream,
  changeTrackedStream,
  changeScrollRef,
  scrollRef,
  streamHeaders,
  credentials,
  client,
  tags,
}) {
  const [sortFunc, setSortFunc] = useState(sortObj.dateDesc);
  const [open, setOpen] = React.useState(false);
  const [editPost, changeEditPost] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const topRef = useRef(null);

  useEffect(() => {
    if (scrollRef) {
      // topRef.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [scrollRef]);

  return (
    <Box ref={topRef}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {editPost?.displayCard ? (
            <EditStream
              tags={tags}
              editPost={editPost}
              streamHeaders={streamHeaders}
              client={client}
            />
          ) : (
            <EditPost
              editPost={editPost}
              streamHeaders={streamHeaders}
              client={client}
            />
          )}
        </Box>
      </Modal>
      <Container>
        <Grid container spacing={1}>
          {trackedStream && streamHeaders && streamData?.length > 0 ? (
            trackedStream.map((v, i) => {
              return (
                <Grid item xs={trackedStream.length === 1 ? 12 : 6} key={i}>
                  <PostCard
                    trackedStream={trackedStream}
                    credentials={credentials}
                    changeEditPost={changeEditPost}
                    openEditModal={handleOpen}
                    changeTrackedStream={changeTrackedStream}
                    postObj={{
                      streamId: v.streamId,
                      h1: `${v.posts} Post${v.posts > 1 ? "s" : ""}`,
                      body: v.streamDescription,
                      h2: "Stream Description: ",
                      datePosted: v.dateCreated,
                      displayCard: true,
                      color: v.color,
                      streamName: v.streamName,
                      images: [],
                      stream: v,
                      hasScrum: credentials._id && credentials.accessToken,
                    }}
                  ></PostCard>
                </Grid>
              );
            })
          ) : JSON.stringify(streamData) === "[]" ? (
            <Grid item xs={12}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    No Posts match...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            {streamData
              ? streamData.sort(sortFunc.exec).map((postObj, i) => {
                  return (
                    <PostCard
                      openEditModal={handleOpen}
                      editPost={editPost}
                      changeEditPost={changeEditPost}
                      key={i}
                      credentials={credentials}
                      postObj={{
                        ...postObj,
                        stream: streamHeaders.filter(
                          (stream) => stream.streamId === postObj.streamId
                        )[0],
                      }}
                      trackedStream={trackedStream}
                      changeTrackedStream={changeTrackedStream}
                      changeScrollRef={changeScrollRef}
                    />
                  );
                })
              : Array(10)
                  .fill(0)
                  .map((v, i) => (
                    <PostCard
                      key={i}
                      trackedStream={trackedStream}
                      changeTrackedStream={changeTrackedStream}
                    />
                  ))}
          </Grid>
          {/* <ListScrollToItem /> */}
        </Grid>
      </Container>
    </Box>
  );
}

// const ListScrollToItem = () => {
//   const refs = streamData.posts.reduce((acc, value) => {
//     acc[value._id] = React.createRef();
//     return acc;
//   }, {});

//   // Scroll Into View API: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
//   const handleClick = (id) =>
//     refs[id].current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });

//   return (
//     <div>
//       <ul>
//         {streamData.posts.map((item) => (
//           <li key={item._id}>
//             <button type="button" onClick={() => handleClick(item._id)}>
//               Scroll Item {item._id} Into View
//             </button>
//           </li>
//         ))}
//       </ul>

//       <ul>
//         {streamData.posts.map((item) => (
//           <li
//             key={item._id}
//             ref={refs[item._id]}
//             style={{ height: "250px", border: "1px solid black" }}
//           >
//             <div>{item._id}</div>
//             <div>{item.firstname}</div>
//             <div>{item.lastname}</div>
//             <div>{item.year}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

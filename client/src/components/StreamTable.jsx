import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PostCard from "./PostCard";
import { sortObj } from "./Utility";

export default function StreamTable({
  streamData,
  trackedStream,
  changeTrackedStream,
  changeScrollRef,
  scrollRef,
  streamHeaders,
}) {
  const [sortFunc, setSortFunc] = useState(sortObj.dateDesc);

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
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            Stream selection
          </Grid>
          {trackedStream && streamHeaders
            ? streamHeaders.map((v, i) => {
                if (trackedStream === v.streamId) {
                  return (
                    <Grid item xs={12} key={i}>
                      <PostCard
                        trackedStream={trackedStream}
                        changeTrackedStream={changeTrackedStream}
                        postObj={{
                          h1: `${v.posts} posts`,
                          body: v.streamDescription,
                          h2: "Stream Description: ",
                          color: v.color,
                          streamName: v.streamName,
                          displayCard: true,
                        }}
                      ></PostCard>
                    </Grid>
                  );
                }
                return null;
              })
            : null}
          <Grid item xs={12}>
            {streamData
              ? streamData.sort(sortFunc.exec).map((postObj, i) => {
                  return (
                    <PostCard
                      key={i}
                      postObj={postObj}
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

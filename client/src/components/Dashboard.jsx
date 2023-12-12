import React, { useEffect, useRef, useState } from "react";
import HomeDrawer from "./HomeDrawer";
import StreamTable from "./StreamTable";
import Pagination from "@mui/material/Pagination";

export default function App({
  client,
  trackedStream,
  changeTrackedStream,
  displayPosts,
  streamHeaders,
  changeScrollRef,
  scrollRef,
  page,
  pages,
  handleChange,
  credentials,
  loadStreams,
}) {
  return (
    <div className="LoggerBuddy">
      <HomeDrawer client={client} credentials={credentials}>
        <StreamTable
          client={client}
          trackedStream={trackedStream}
          changeTrackedStream={changeTrackedStream}
          streamData={displayPosts?.posts}
          streamHeaders={streamHeaders}
          // streamData={displayPosts.posts}
          // streamData={[]}
          changeScrollRef={changeScrollRef}
          scrollRef={scrollRef}
          credentials={credentials}
          loadStreams={loadStreams}
        />
        <Pagination
          showFirstButton={page != 1}
          showLastButton={page != pages}
          page={page}
          onChange={handleChange}
          count={pages}
        />
      </HomeDrawer>
    </div>
  );
}
//

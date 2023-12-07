import React, { useEffect, useRef, useState } from "react";
import HomeDrawer from "./HomeDrawer";
import StreamTable from "./StreamTable";
import Pagination from "@mui/material/Pagination";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const pageSize = 5;

export default function App({ client }) {
  const [displayPosts, changeDisplayPosts] = useState();
  const [streamHeaders, changeStreamHeaders] = useState([]);
  const [trackedStream, changeTrackedStream] = useState();
  const [scrollRef, changeScrollRef] = useState();

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
    changeDisplayPosts();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    loadPosts(trackedStream, value);
  };

  const loadStreams = async (index = false) => {
    const dbActiveStream = await client.getStreamHeaders(index);
    // console.log(dbActiveStream);
    changeStreamHeaders(dbActiveStream.data);

    setPages(
      Math.floor(
        streamHeaders
          ? dbActiveStream.data?.reduce((acc, next) => acc + next.posts, 0) /
              pageSize
          : 0
      )
    );
  };

  const loadPosts = async (streamIndex = false, page = 1) => {
    const posts = await client.getPosts(streamIndex, page);
    changeDisplayPosts({ posts: posts.data });
  };

  useEffect(() => {
    loadStreams();
    loadPosts(false, 1);
  }, []);

  useEffect(() => {
    loadPosts(trackedStream);
    if (trackedStream) {
      streamHeaders.forEach((h) => {
        if (h.streamId === trackedStream) {
          setPages(Math.floor(h.posts / pageSize));
          return;
        }
      });
    } else {
      setPages(
        Math.floor(
          streamHeaders
            ? streamHeaders?.reduce((acc, next) => acc + next.posts, 0) /
                pageSize
            : 0
        )
      );
    }
  }, [trackedStream]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="LoggerBuddy">
        <HomeDrawer client={client}>
          <>
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
            />
            <Pagination
              showFirstButton={page != 1}
              showLastButton={page != pages}
              page={page}
              onChange={handleChange}
              count={pages}
            />
          </>
        </HomeDrawer>
      </div>
    </ThemeProvider>
  );
}
//

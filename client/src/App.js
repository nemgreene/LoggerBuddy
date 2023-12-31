import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ApiClient } from "./apiClient";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/Admin";
import LoginComponent from "./components/Login";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import {
  toastrConfig,
  pageSize,
  darkTheme,
  syncTrackedPosts,
} from "./components/Utility";
import ScrumBoard from "./components/pages/ScrumBoard/ScrumBoard";

// import LoginComponent from "./components/public/LoginComponent";
// import RegisterCard from "./components/public/RegisterCard";
const modalHandler = (status, message, config = undefined) => {
  if (status < 300) {
    toast.success(message, { ...toastrConfig });
  } else if (status >= 300 && status < 400) {
    toast.warning(message, { ...toastrConfig });
  } else {
    toast.error(message, { ...toastrConfig });
  }
};
function ProtectedRoute({ redirect = "/", children }) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to={redirect} replace />;
  }
  return children;
}

function App() {
  //#region Routing
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    accessToken: undefined,
    _id: undefined,
  });

  const credentialsManager = (accessToken, _id) => {
    setCredentials({
      accessToken,
      _id,
    });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user_id", _id);
  };

  const logoutHandler = async () => {
    console.log("logging out");
    setCredentials({
      accessToken: undefined,
      _id: undefined,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_id");
    modalHandler(200, "Logged out successful");
  };

  const redirectHandler = (url) => {
    navigate(url);
  };

  const [storedStream, changeStoredStream] = useState({});
  const [displayPosts, changeDisplayPosts] = useState();
  const [streamHeaders, changeStreamHeaders] = useState([]);
  const [trackedStream, changeTrackedStream] = useState([]);
  const [tags, changeTags] = useState([]);
  const [scrollRef, changeScrollRef] = useState();
  const [storedPage, changeStoredPage] = useState(1);
  const [activeTags, changeActiveTags] = useState([]);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
    changeDisplayPosts();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    loadTaggedData(value);
  };

  const loadTaggedData = async (page = 1, reset = false) => {
    console.log("Loading data");
    if (reset) {
      setPage(1);
      page = 1;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const ret = await client.getTaggedPosts(
      activeTags,
      page,
      trackedStream.map((v) => v.streamId)
    );
    if (ret.data) {
      const { streams, posts } = ret.data;
      changeDisplayPosts({ posts });

      setPages(
        Math.ceil(
          streams
            ? streams?.reduce((acc, next) => acc + next.posts, 0) / pageSize
            : 0
        )
      );
    } else {
      changeDisplayPosts([]);
      setPages(1);
    }
  };

  const loadStreams = async (index = trackedStream) => {
    //setup overhad initialization
    const streamOverhead = await client.getStreamHeaders(index);
    changeStreamHeaders(streamOverhead.data);

    //if streams are being tracked, this should updated them as well
    if (trackedStream.length > 0) {
      syncTrackedPosts(changeTrackedStream, streamOverhead.data);
    }
    const uniqueTags = [
      ...new Set(
        streamOverhead.data.reduce((acc, next) => [...acc, ...next.tags], [])
      ),
    ];
    changeTags(uniqueTags);

    const totalPages = Math.ceil(
      streamOverhead.data
        ? streamOverhead.data?.reduce((acc, next) => acc + next.posts, 0) /
            pageSize
        : 0
    );
    setPages(totalPages);
  };

  useEffect(() => {
    const [accessToken, _id] = [
      localStorage.getItem("accessToken"),
      localStorage.getItem("user_id"),
    ];
    if (accessToken && _id) {
      client.credentialsManager(accessToken, _id);
    }
    loadStreams();
  }, []);

  useEffect(() => {
    if (trackedStream.length > 0) {
      setPage(1);
      loadTaggedData(1);
    } else {
      setPage(storedPage);
      loadTaggedData(storedPage);
    }
  }, [trackedStream]);

  useEffect(() => {
    setPage(1);
    loadTaggedData(1);
  }, [activeTags]);

  const client = new ApiClient(
    () => ({
      accessToken: credentials.accessToken,
      _id: credentials._id,
    }),
    () => logoutHandler(),
    modalHandler,
    redirectHandler,
    credentialsManager,
    loadTaggedData,
    loadStreams
  );

  // useEffect(() => {
  //   const [accessToken, refreshToken, _id] = [
  //     localStorage.getItem("accessToken"),
  //     localStorage.getItem("refreshToken"),
  //     localStorage.getItem("user_id"),
  //   ];
  //   if (accessToken && refreshToken) {
  //     setCredentials((p) => ({ ...p, accessToken, refreshToken, _id }));
  //   } else {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <div className="appContainer">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="dark"
        />
        <Routes>
          <Route
            path="/login"
            element={
              <LoginComponent client={client} setCredentials={setCredentials} />
            }
          />
          {/* <Route path="/register" element={<RegisterCard client={client} />} /> */}
          {/* <Route
          path="/"
          element={
            <ProtectedRoute>
            <Dashboard client={client} logoutHandler={logoutHandler} />
            </ProtectedRoute>
          }
        /> */}
          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Dashboard
                activeTags={activeTags}
                changeActiveTags={changeActiveTags}
                tags={tags}
                page={page}
                pages={pages}
                client={client}
                scrollRef={scrollRef}
                credentials={credentials}
                displayPosts={displayPosts}
                trackedStream={trackedStream}
                streamHeaders={streamHeaders}
                handleChange={handleChange}
                logoutHandler={logoutHandler}
                changeScrollRef={changeScrollRef}
                changeTrackedStream={(e) => {
                  changeDisplayPosts();
                  if (!trackedStream) {
                    changeStoredPage(page);
                  }
                  changeTrackedStream(e);
                }}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/scrum/:trackedStream"
            element={<ScrumBoard client={client} credentials={credentials} />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard
                  tags={tags}
                  changeStreamHeaders={changeStreamHeaders}
                  client={client}
                  streamHeaders={streamHeaders}
                  storedStream={storedStream}
                  changeStoredStream={changeStoredStream}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ApiClient } from "./apiClient";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/Admin";
import LoginComponent from "./components/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";

// import LoginComponent from "./components/public/LoginComponent";
// import RegisterCard from "./components/public/RegisterCard";

let toastrConfig = {
  position: "top-right",
  autoClose: 700,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};
const pageSize = 5;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

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
    // setCredentials({
    //   accessToken: undefined,
    //   _id: undefined,
    // });
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("user_id");
  };

  const modalHandler = (status, message, config = undefined) => {
    if (status < 300) {
      toast.success(message, { ...toastrConfig });
    } else if (status >= 300 && status < 400) {
      toast.warning(message, { ...toastrConfig });
    } else {
      toast.error(message, { ...toastrConfig });
    }
  };

  const redirectHandler = (url) => {
    navigate(url);
  };

  function ProtectedRoute({ redirect = "/", children }) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return <Navigate to={redirect} replace />;
    }
    return children;
  }
  //#endregion

  //#region Posts
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
      Math.ceil(
        dbActiveStream.data
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

    const [accessToken, _id] = [
      localStorage.getItem("accessToken"),
      localStorage.getItem("user_id"),
    ];
    if (accessToken && _id) {
      client.credentialsManager(accessToken, _id);
    }
  }, []);

  useEffect(() => {
    loadPosts(trackedStream);
    if (trackedStream) {
      streamHeaders.forEach((h) => {
        if (h.streamId === trackedStream) {
          setPages(Math.ceil(h.posts / pageSize));
          return;
        }
      });
    } else {
      setPages(
        Math.ceil(
          streamHeaders
            ? streamHeaders?.reduce((acc, next) => acc + next.posts, 0) /
                pageSize
            : 0
        )
      );
    }
  }, [trackedStream]);
  //#endregion

  const client = new ApiClient(
    () => ({
      accessToken: credentials.accessToken,
      _id: credentials._id,
    }),
    () => logoutHandler(),
    modalHandler,
    redirectHandler,
    credentialsManager,
    () => {
      loadStreams();
      loadPosts(false, page);
    }
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
                page={page}
                pages={pages}
                client={client}
                scrollRef={scrollRef}
                credentials={credentials}
                displayPosts={displayPosts}
                trackedStream={trackedStream}
                streamHeaders={streamHeaders}
                loadStreams={loadStreams}
                handleChange={handleChange}
                logoutHandler={logoutHandler}
                changeScrollRef={changeScrollRef}
                changeTrackedStream={changeTrackedStream}
              />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard
                  client={client}
                  streamHeaders={streamHeaders}
                  loadStreams={loadStreams}
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

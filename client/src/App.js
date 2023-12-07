import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ApiClient } from "./apiClient";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/Admin";

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

function App() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    accessToken: undefined,
    refreshToken: undefined,
    _id: undefined,
  });

  const credentialsManager = (accessToken, refreshToken, _id) => {
    setCredentials({
      accessToken,
      refreshToken,
      _id,
    });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user_id", _id);
  };

  const logoutHandler = async () => {
    setCredentials({
      accessToken: undefined,
      refreshToken: undefined,
      _id: undefined,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
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

  const client = new ApiClient(
    () => ({
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      _id: credentials._id,
    }),
    () => logoutHandler(),
    modalHandler,
    redirectHandler,
    credentialsManager
  );

  function ProtectedRoute({ redirect = "/", children }) {
    const [accessToken, refreshToken] = [
      localStorage.getItem("accessToken"),
      localStorage.getItem("refreshToken"),
    ];
    if (!accessToken || !refreshToken) {
      return <Navigate to={redirect} replace />;
    }
    return children;
  }

  useEffect(() => {
    const [accessToken, refreshToken, _id] = [
      localStorage.getItem("accessToken"),
      localStorage.getItem("refreshToken"),
      localStorage.getItem("user_id"),
    ];
    if (accessToken && refreshToken) {
      setCredentials((p) => ({ ...p, accessToken, refreshToken, _id }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="appContainer">
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
        {/* <Route
          path="/login"
          element={
            <LoginComponent client={client} setCredentials={setCredentials} />
          }
        /> */}
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
            <Dashboard client={client} logoutHandler={logoutHandler} />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard client={client} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useAuthContext } from "./contexts/authContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Classroom from "./pages/Classroom";

function App() {
  const { isLoggedIn } = useAuthContext();

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        {isLoggedIn === true && (
          <>
            <Route path="/classroom" element={<Classroom />} />
          </>
        )}
        {isLoggedIn === false && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ChangePassword from "./pages/ChangePassword";
import Verify from "./pages/Verify";
import EnterEmail from "./pages/EnterEmail";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Profile />} path="/profile" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<Signin />} path="/signin" />
        <Route element={<Verify />} path="/verify" />
        <Route element={<EnterEmail />} path="/changepassword" />
        <Route element={<ChangePassword />} path="/changePassword/:token" />
      </Routes>
    </>
  );
}

export default App;

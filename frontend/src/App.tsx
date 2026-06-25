import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "@/pages/Feed";
import Discover from "@/pages/Discover";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VisitorLayout from "./layouts/VisitorLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import VisitorDiscover from "./pages/VisitorDiscover";
import Users from "./pages/Admin/Users";
import Albums from "./pages/Admin/Albums";
import Photos from "./pages/Admin/Photos";
import UserProfile from "./components/user/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<VisitorLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<VisitorDiscover />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/photos" element={<Photos />} />
          <Route path="/admin/albums" element={<Albums />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

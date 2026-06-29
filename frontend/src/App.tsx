import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "@/pages/Feed";
import Discover from "@/pages/Discover";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VisitorLayout from "@/layouts/VisitorLayout";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

import VisitorDiscover from "@/pages/VisitorDiscover";
import Users from "@/pages/Admin/Users";
import AlbumsAdmin from "@/pages/Admin/Albums";
import PhotosAdmin from "@/pages/Admin/Photos";
import UserProfile from "@/pages/Admin/UserProfile";
import Photos from "@/pages/User/Photos";
import Albums from "@/pages/User/Albums";
import Follower from "@/pages/User/Follower";
import Following from "@/pages/User/Following";
import EditPhoto from "@/components/photo/EditPhoto";
import EditAlbum from "@/components/album/EditAlbum";
import EditProfile from "@/components/user/EditProfile";
import NotFound from "@/pages/NotFound";

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
          <Route path="/photos" element={<Photos />} />
          <Route path="/photos/:id" element={<EditPhoto />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<EditAlbum />} />
          <Route path="/followers" element={<Follower />} />
          <Route path="/followings" element={<Following />} />
          <Route path="/profile" element={<EditProfile />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/photos" element={<PhotosAdmin />} />
          <Route path="/admin/albums" element={<AlbumsAdmin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

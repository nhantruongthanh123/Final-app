import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "@/pages/Home/Feed";
import Discover from "@/pages/Home/Discover";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import VisitorLayout from "@/layouts/VisitorLayout";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

import VisitorDiscover from "@/pages/Home/VisitorDiscover";
import Users from "@/pages/Admin/Users";
import AlbumsAdmin from "@/pages/Admin/Albums";
import PhotosAdmin from "@/pages/Admin/Photos";
import UserProfile from "@/pages/Admin/UserProfile";
import Photos from "@/pages/User/Photos";
import Albums from "@/pages/User/Albums";
import Follower from "@/pages/User/Follower";
import Following from "@/pages/User/Following";
import EditPhotoUser from "@/pages/User/EditPhoto";
import EditPhotoAdmin from "@/pages/Admin/EditPhoto";
import EditAlbumUser from "@/pages/User/EditAlbum";
import EditProfile from "@/pages/User/EditProfile";
import NotFound from "@/pages/NotFound";
import EditAlbumAdmin from "@/pages/Admin/EditAlbum";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuthStore } from "./store/authStore";
import { useEffect, useRef } from "react";
import { AuthService } from "@/services/authService";

function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const setCheckingAuth = useAuthStore((state) => state.setCheckingAuth);

  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      try {
        const response = await AuthService.refreshToken();
        setAuth(response.accessToken, response.user);
      } catch (error) {
        clearAuth();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        Loading PhotoBook...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
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
            <Route path="/photos/:id" element={<EditPhotoUser />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:id" element={<EditAlbumUser />} />
            <Route path="/followers" element={<Follower />} />
            <Route path="/followings" element={<Following />} />
            <Route path="/profile" element={<EditProfile />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/photos" element={<PhotosAdmin />} />
            <Route path="/admin/photos/:id" element={<EditPhotoAdmin />} />
            <Route path="/admin/albums" element={<AlbumsAdmin />} />
            <Route path="/admin/albums/:id" element={<EditAlbumAdmin />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/:id" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

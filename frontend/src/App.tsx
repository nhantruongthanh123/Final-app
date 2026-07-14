import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import VisitorLayout from "@/layouts/VisitorLayout";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Discover from "@/pages/Home/Discover";
import Feed from "@/pages/Home/Feed";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AlbumsAdmin from "@/pages/Admin/Albums";
import EditAlbumAdmin from "@/pages/Admin/EditAlbum";
import EditPhotoAdmin from "@/pages/Admin/EditPhoto";
import PhotosAdmin from "@/pages/Admin/Photos";
import UserProfile from "@/pages/Admin/UserProfile";
import Users from "@/pages/Admin/Users";
import NotFound from "@/pages/NotFound";
import Albums from "@/pages/User/Albums";
import EditAlbumUser from "@/pages/User/EditAlbum";
import EditPhotoUser from "@/pages/User/EditPhoto";
import EditProfile from "@/pages/User/EditProfile";
import Follower from "@/pages/User/Follower";
import Following from "@/pages/User/Following";
import Photos from "@/pages/User/Photos";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthService } from "@/services/authService";
import { useEffect, useRef } from "react";
import TargetUserProfileLayout from "./layouts/TargetUserProfileLayout";
import UserProfileLayout from "./layouts/UserProfileLayout";
import VisitorDiscover from "./pages/Home/VisitorDiscover";
import AddPhoto from "./pages/User/AddPhoto";
import TargetUserAlbums from "./pages/User/TargetUserAlbums";
import TargetUserFollower from "./pages/User/TargetUserFollower";
import TargetUserFollowing from "./pages/User/TargetUserFollowing";
import TargetUserPhotos from "./pages/User/TargetUserPhotos";
import { useAuthStore } from "./store/authStore";

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
        console.error("Failed to refresh token:", error);
        clearAuth();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [setAuth, clearAuth, setCheckingAuth]);

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
            <Route path="/photos/add" element={<AddPhoto />} />
            <Route path="/photos/:id" element={<EditPhotoUser />} />
            <Route path="/albums/:id" element={<EditAlbumUser />} />
            <Route path="/profile" element={<EditProfile />} />

            <Route element={<UserProfileLayout />}>
              <Route path="/photos" element={<Photos />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/followers" element={<Follower />} />
              <Route path="/followings" element={<Following />} />
            </Route>

            <Route path="users/:id" element={<TargetUserProfileLayout />}>
              <Route path="photos" element={<TargetUserPhotos />} />
              <Route path="albums" element={<TargetUserAlbums />} />
              <Route path="followers" element={<TargetUserFollower />} />
              <Route path="followings" element={<TargetUserFollowing />} />
            </Route>
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
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

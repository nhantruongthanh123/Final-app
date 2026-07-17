import FormField from "@/components/shared/FormField";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const user = useAuthStore.getState().user;
  const updateUser = useAuthStore((state) => state.updateUser);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.promise(UserService.updateUserAvatar(file), {
        loading: "Updating user information...",
        success: (updatedUser) => {
          updateUser(updatedUser);
          return "Update user information successfully!";
        },
        error: "Failed to update user information",
      });

      await UserService.updateUserAvatar(file);
      toast.success("Profile picture updated successfully!", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Error updating user avatar:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/profile");
    }
  };

  const handleSaveChanges = async () => {
    try {
      toast.promise(
        UserService.updateUserProfile({
          email,
          firstName,
          lastName,
        }),
        {
          loading: "Updating user information...",
          success: (updatedUser) => {
            updateUser(updatedUser);
            return "Update user information successfully!";
          },
          error: "Failed to update user information",
        },
      );
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      navigate("/profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== passwordConfirmation) {
      toast.error("Confirmation password does not match the new password.", {
        duration: 4000,
      });

      return;
    }

    try {
      await UserService.updateUserPassword({
        password,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password.");
    } finally {
      navigate("/profile");
    }
  };

  useEffect(() => {}, [user]);

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <PageHeader title="Edit Profile" backlink="/photos" />
      <div className="flex flex-col items-center justify-center w-full">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-indigo-800 flex items-center justify-center text-white text-4xl font-bold">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
        )}
        <Button
          className="mt-4"
          variant="outline"
          size="sm"
          onClick={handleAvatarChange}
        >
          Change Profile Picture
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto mt-4">
        {/* Left Column: Basic Information */}
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-brand mb-4">
            Basic Information
          </h2>
          <div className="flex flex-col gap-4">
            <FormField
              label="FirstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <FormField
              label="LastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <FormField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="mt-4 md:mt-6"
            variant="outline"
            size="sm"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>

        {/* Right Column: Password */}
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-brand mb-4">Password</h2>
          <div className="flex flex-col gap-4">
            <FormField
              label="Current Password"
              placeholder="Enter your current password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              label="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormField
              label="Password Confirmation"
              placeholder="Confirm your new password"
              value={passwordConfirmation}
              type="password"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <Button
            className="mt-4 md:mt-6"
            variant="outline"
            size="sm"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

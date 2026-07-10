import FormField from "@/components/shared/FormField";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { UpdateUserProfileData } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

const EditProfile = () => {
  const user = useAuthStore.getState().user;
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSaveChanges = async () => {
    try {
      await UserService.updateUserProfile({
        email,
        firstName,
        lastName,
      } as UpdateUserProfileData);
      toast.success("Profile updated successfully!", { duration: 4000 });
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update profile.", { duration: 4000 });
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
      toast.success("Password changed successfully!", { duration: 4000 });
      setPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password.", { duration: 4000 });
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <PageHeader title="Edit Profile" backlink="/photos" />
      <div className="flex flex-col items-center justify-center w-full">
        <img
          src={user?.avatarUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <Button className="mt-4" variant="outline" size="sm">
          Change Profile Picture
        </Button>
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

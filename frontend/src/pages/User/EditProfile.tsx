import FormField from "@/components/shared/FormField";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  avatarSchema,
  passwordSchema,
  profileSchema,
  type PasswordPayload,
  type ProfilePayload,
} from "@/schemas/user.schema";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditProfile = () => {
  const user = useAuthStore.getState().user;
  const updateUser = useAuthStore((state) => state.updateUser);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfilePayload>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordPayload>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = avatarSchema.safeParse(file);

    if (!validation.success) {
      toast.error(validation.error.issues[0].message, { duration: 4000 });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    toast.promise(UserService.updateUserAvatar(file), {
      loading: "Updating user information...",
      success: (updatedUser) => {
        updateUser(updatedUser);
        return "Update user information successfully!";
      },
      error: (error) => {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return error.response.data.message;
        }
        return "Failed to update user information";
      },
    });
  };

  const handleSaveChanges = async (data: ProfilePayload) => {
    toast.promise(
      UserService.updateUserProfile({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
      {
        loading: "Updating user information...",
        success: (updatedUser) => {
          updateUser(updatedUser);
          return "Update user information successfully!";
        },
        error: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            return error.response.data.message;
          }
          return "Failed to update user information";
        },
      },
    );
  };

  const handleChangePassword = async (data: PasswordPayload) => {
    if (data.newPassword !== data.passwordConfirmation) {
      toast.error("Confirmation password does not match the new password.", {
        duration: 4000,
      });

      return;
    }

    await toast.promise(
      UserService.updateUserPassword({
        password: data.password,
        newPassword: data.newPassword,
      }),
      {
        loading: "Changing password...",
        success: () => {
          resetPasswordForm();
          return "Password changed successfully!";
        },
        error: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            return error.response.data.message;
          }
          return "Failed to update user information";
        },
      },
    );
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
        <form
          className="flex-1 w-full"
          onSubmit={handleProfileSubmit(handleSaveChanges)}
        >
          <h2 className="text-lg font-bold text-brand mb-4">
            Basic Information
          </h2>
          <div className="flex flex-col gap-4">
            <FormField
              label="First Name"
              placeholder="Enter your first name"
              {...registerProfile("firstName")}
              error={profileErrors.firstName?.message}
            />

            <FormField
              label="Last Name"
              placeholder="Enter your last name"
              {...registerProfile("lastName")}
              error={profileErrors.lastName?.message}
            />

            <FormField
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...registerProfile("email")}
              error={profileErrors.email?.message}
            />
          </div>
          <Button
            className="mt-4 md:mt-6"
            variant="outline"
            size="sm"
            type="submit"
          >
            {isProfileSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        {/* Right Column: Password */}
        <form className="flex-1 w-full">
          <h2 className="text-lg font-bold text-brand mb-4">Password</h2>
          <div className="flex flex-col gap-4">
            <FormField
              label="Current Password"
              placeholder="Enter your current password"
              type="password"
              {...registerPassword("password")}
              error={passwordErrors.password?.message}
            />
            <FormField
              label="New Password"
              placeholder="Enter your new password"
              type="password"
              {...registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />
            <FormField
              label="Password Confirmation"
              placeholder="Confirm your new password"
              type="password"
              {...registerPassword("passwordConfirmation")}
              error={passwordErrors.passwordConfirmation?.message}
            />
          </div>
          <Button
            className="mt-4 md:mt-6"
            variant="outline"
            size="sm"
            onClick={handlePasswordSubmit(handleChangePassword)}
            disabled={isPasswordSubmitting}
          >
            {isPasswordSubmitting ? "Saving..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

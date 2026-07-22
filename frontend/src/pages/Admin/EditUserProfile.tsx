import FormField from "@/components/shared/FormField";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  avatarSchema,
  profileSchema,
  type ProfilePayload,
} from "@/schemas/user.schema";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const { id } = useParams() || "";
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfilePayload>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
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

    if (!id) {
      toast.error("User ID is required");
      return null;
    }

    toast.promise(UserService.updateUserAvatarByAdmin(id, file), {
      loading: "Updating user information...",
      success: () => {
        navigate(`/admin/users/${id}`);
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
    if (!id) {
      toast.error("User ID is required");
      return null;
    }

    toast.promise(UserService.updateUserProfileByAdmin(id, data), {
      loading: "Updating user information...",
      success: () => {
        navigate(`/admin/users/${id}`);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UserService.getUserById(id);
        setUser(user);
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("email", user.email);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("User not found");
        }
      }
    };

    fetchUser();
  }, [id, setValue]);

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <PageHeader title="Edit Profile" backlink="/admin/users" />
      <div className="flex flex-col items-center justify-center w-full">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-indigo-800 flex items-center justify-center text-white text-4xl font-bold">
            {user?.firstName[0]?.toUpperCase()}
            {user?.lastName[0]?.toUpperCase()}
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

      <div className="flex flex-col items-center justify-center w-full ">
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
      </div>
    </div>
  );
};

export default EditProfile;

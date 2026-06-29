import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import FormField from "@/components/shared/FormField";

const EditProfile = () => {
  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <PageHeader title="Edit Profile" backlink="/photos" />
      <div className="flex flex-col items-center justify-center w-full">
        <img
          src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-021.jpg"
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
            <FormField label="Username" placeholder="Enter your username" />
            <FormField label="Email" placeholder="Enter your email" />
          </div>
          <Button className="mt-4 md:mt-6" variant="outline" size="sm">
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
            />
            <FormField
              label="New Password"
              placeholder="Enter your new password"
            />
            <FormField
              label="Password Confirmation"
              placeholder="Confirm your new password"
            />
          </div>
          <Button className="mt-4 md:mt-6" variant="outline" size="sm">
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

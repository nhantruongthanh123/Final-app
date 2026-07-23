const PublicUserInfo = ({
  firstName,
  lastName,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}) => {
  return (
    <div className="flex flex-row gap-4">
      {avatarUrl ? (
        <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white">
          <img
            src={avatarUrl}
            alt={firstName}
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white">
          {firstName.charAt(0) + lastName.charAt(0)}{" "}
        </div>
      )}

      <div className="text-brand flex items-center justify-center">
        {firstName} {lastName}
      </div>
    </div>
  );
};

export default PublicUserInfo;

export function formatFeedPhotos(photo: any) {
  const { _count, photoLikes, user, ...rest } = photo;
  const { followers, ...cleanUser } = user;

  return {
    ...rest,
    numLikes: _count.photoLikes,
    isLiked: photoLikes?.length > 0,
    user: {
      ...cleanUser,
      isFollowing: followers?.length > 0,
    },
  };
}

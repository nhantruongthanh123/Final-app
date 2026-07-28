export function formatFeedAlbums(album: any) {
  const { _count, albumLikes, user, ...rest } = album;
  const { followers, ...cleanUser } = user;

  return {
    ...rest,
    numLikes: _count.albumLikes,
    isLiked: albumLikes?.length > 0,
    user: {
      ...cleanUser,
      isFollowing: followers?.length > 0,
    },
  };
}

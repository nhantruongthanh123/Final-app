export function formatFeedAlbums(album: any) {
  const { _count, albumLikes, ...rest } = album;

  return {
    ...rest,
    numLikes: _count.albumLikes,
    isLiked: albumLikes.length > 0,
  };
}

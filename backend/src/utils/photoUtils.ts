export function formatFeedPhotos(photo: any) {
  const { _count, photoLikes, ...rest } = photo;

  return {
    ...rest,
    numLikes: _count.photoLikes,
    isLiked: photoLikes?.length > 0,
  };
}

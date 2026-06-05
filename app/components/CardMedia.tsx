export function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function CardMedia({ url }: { url: string }) {
  if (isVideo(url)) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={url}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }
  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}

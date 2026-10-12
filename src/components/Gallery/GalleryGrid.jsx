export default function GalleryGrid({ media, onSelect }) {
  if (media.length === 0) {
    return (
      <div className="text-center text-ink-300 mt-16 px-8">
        <div className="text-4xl mb-2">🖼️</div>
        <p>
          No photos or videos yet. Tap the camera button to add the first one!
        </p>
      </div>
    );
  }

  const rotations = ["-rotate-2", "rotate-1.5", "rotate-[-1deg]", "rotate-2"];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4">
      {media.map((item, i) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={`polaroid ${rotations[i % rotations.length]} hover:rotate-0 hover:scale-[1.03] transition`}
        >
          <div className="relative aspect-square bg-ink-50 overflow-hidden">
            {item.type === "video" ? (
              <>
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
                <span className="absolute bottom-1 right-1 text-white text-lg drop-shadow">
                  ▶
                </span>
              </>
            ) : (
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            {item.reactions && Object.keys(item.reactions).length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-white/95 rounded-full text-xs px-1.5 py-0.5 shadow-sm">
                ❤️ {Object.keys(item.reactions).length}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function GalleryGrid({ media, onSelect }) {
  if (media.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-16 px-8">
        <div className="text-4xl mb-2">🖼️</div>
        <p>No photos or videos yet. Tap the camera button to add the first one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 px-1">
      {media.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="relative aspect-square bg-gray-100 overflow-hidden"
        >
          {item.type === 'video' ? (
            <>
              <video src={item.url} className="w-full h-full object-cover" muted />
              <span className="absolute bottom-1 right-1 text-white text-lg drop-shadow">▶</span>
            </>
          ) : (
            <img src={item.url} alt="" className="w-full h-full object-cover" loading="lazy" />
          )}
          {item.reactions && Object.keys(item.reactions).length > 0 && (
            <span className="absolute top-1 right-1 bg-white/90 rounded-full text-xs px-1.5 py-0.5">
              ❤️ {Object.keys(item.reactions).length}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

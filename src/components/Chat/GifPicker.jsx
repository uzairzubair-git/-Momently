// This is a placeholder sticker picker so the app works out of the box with
// no external API keys. To use real GIFs later:
//   1. Get a free API key from Giphy (https://developers.giphy.com) or Tenor.
//   2. Replace the STICKERS array below with a fetch() call to their search
//      endpoint, and render the results the same way.
const STICKERS = [
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'love', emoji: '😍', label: 'Love it' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'laugh', emoji: '🤣', label: 'LOL' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'cake', emoji: '🎂', label: 'Cake' },
  { id: 'cheers', emoji: '🥂', label: 'Cheers' },
  { id: 'dance', emoji: '💃', label: 'Dance' },
]

export default function GifPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 card p-3 shadow-lg">
      <p className="text-xs text-gray-400 mb-2">Stickers</p>
      <div className="grid grid-cols-3 gap-2">
        {STICKERS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              onSelect(s)
              onClose()
            }}
            className="flex flex-col items-center justify-center gap-1 bg-brand-50 rounded-xl2 py-4 active:scale-95 transition"
          >
            <span className="text-4xl">{s.emoji}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

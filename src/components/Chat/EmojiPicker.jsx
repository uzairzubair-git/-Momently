const EMOJIS = [
  '😀', '😂', '😍', '😘', '😎', '🤩', '🥳', '😭',
  '😢', '😡', '🤔', '😴', '🙌', '👏', '👍', '👎',
  '🙏', '💪', '❤️', '🔥', '🎉', '🎊', '✨', '💯',
  '🍕', '🍰', '🍾', '📸', '💃', '🕺', '😅', '🤗',
]

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 card p-3 grid grid-cols-8 gap-1 shadow-lg">
      {EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => {
            onSelect(e)
            onClose()
          }}
          className="text-2xl p-1 rounded-lg hover:bg-gray-100 active:scale-90 transition"
        >
          {e}
        </button>
      ))}
    </div>
  )
}

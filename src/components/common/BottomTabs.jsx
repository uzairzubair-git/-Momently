export default function BottomTabs({ active, onChange }) {
  const tabs = [
    { key: 'gallery', label: 'Gallery', icon: '🖼️' },
    { key: 'chat', label: 'Chat', icon: '💬' },
  ]

  return (
    <nav className="shrink-0 bg-white border-t border-gray-100 flex z-20">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium ${
            active === t.key ? 'text-brand-500' : 'text-gray-400'
          }`}
        >
          <span className="text-xl mb-0.5">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

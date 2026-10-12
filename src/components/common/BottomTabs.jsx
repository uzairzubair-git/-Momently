export default function BottomTabs({ active, onChange }) {
  const tabs = [
    { key: "gallery", label: "Gallery", icon: "🖼️" },
    { key: "chat", label: "Chat", icon: "💬" },
  ];

  return (
    <nav className="shrink-0 bg-paper px-4 pb-4 pt-2 z-20">
      <div className="floatnav-pill flex max-w-xs mx-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium rounded-full transition ${
              active === t.key
                ? "bg-marigold-500 text-ink-900 m-1"
                : "text-ink-300"
            }`}
          >
            <span className="text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

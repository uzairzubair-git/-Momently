const COLORS = ['#e0447b', '#f2994a', '#5b4b8a', '#4e3d79', '#dd7a1f', '#c22a60']

function colorFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Avatar({ name = '?', size = 36 }) {
  const initials = name
    .trim()
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, backgroundColor: colorFor(name), fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </div>
  )
}

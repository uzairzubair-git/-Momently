import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/common/Avatar'

export default function GroupList() {
  const { currentUser, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'groups'),
      where('memberIds', 'array-contains', currentUser.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setGroups(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [currentUser.uid])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar name={profile?.name} size={42} />
          <div>
            <p className="text-xs text-gray-400">Welcome back</p>
            <p className="font-semibold text-gray-800">{profile?.name}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-400 font-medium">
          Log out
        </button>
      </header>

      <main className="px-5 pt-5">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Your groups</h1>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}

        {!loading && groups.length === 0 && (
          <div className="card p-6 text-center mt-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-gray-500 mb-4">
              You're not part of any groups yet. Create one, or ask a friend for an invite link!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {groups.map((g) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              className="card p-4 flex items-center gap-3 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl2 bg-brand-100 flex items-center justify-center text-2xl">
                🎊
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{g.name}</p>
                <p className="text-xs text-gray-400">
                  {g.memberIds?.length || 1} member{g.memberIds?.length === 1 ? '' : 's'}
                  {g.adminIds?.includes(currentUser.uid) ? ' · You are admin' : ''}
                </p>
              </div>
              <span className="text-gray-300">›</span>
            </Link>
          ))}
        </div>
      </main>

      <Link
        to="/groups/new"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-500 text-white text-3xl flex items-center justify-center shadow-lg active:scale-95 transition"
      >
        +
      </Link>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function CreateGroup() {
  const { currentUser, profile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        name: name.trim(),
        creatorId: currentUser.uid,
        adminIds: [currentUser.uid],
        memberIds: [currentUser.uid],
        openJoin: true,
        createdAt: serverTimestamp(),
      })

      // Add the creator to the members subcollection too, so we have
      // per-member info (name, role, joinedAt) without extra lookups.
      await setDoc(doc(db, 'groups', groupRef.id, 'members', currentUser.uid), {
        uid: currentUser.uid,
        name: profile?.name || 'Member',
        role: 'admin',
        joinedAt: serverTimestamp(),
      })

      navigate(`/groups/${groupRef.id}`)
    } catch (err) {
      setError('Something went wrong creating the group. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 pt-6 pb-10">
      <Link to="/groups" className="text-gray-400 text-sm">
        ‹ Back
      </Link>
      <h1 className="text-xl font-bold text-gray-800 mt-2 mb-6">Create a group</h1>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Group name</label>
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field mt-1"
            placeholder="Ali's Birthday Party"
          />
        </div>
        <p className="text-xs text-gray-400">
          You'll automatically become the admin. You can invite people with a link once the
          group is created.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Creating…' : 'Create group'}
        </button>
      </form>
    </div>
  )
}

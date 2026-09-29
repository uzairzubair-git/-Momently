import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../hooks/useGroup'

export default function JoinGroup() {
  const { groupId } = useParams()
  const { currentUser, profile } = useAuth()
  const navigate = useNavigate()
  const { group, loading, notFound, isMember } = useGroup(groupId, currentUser.uid)
  const [status, setStatus] = useState('idle') // idle | joining | requested | error
  const [alreadyRequested, setAlreadyRequested] = useState(false)

  useEffect(() => {
    async function checkExistingRequest() {
      if (!group || isMember) return
      const reqSnap = await getDoc(doc(db, 'groups', groupId, 'joinRequests', currentUser.uid))
      setAlreadyRequested(reqSnap.exists())
    }
    checkExistingRequest()
  }, [group, isMember, groupId, currentUser.uid])

  useEffect(() => {
    if (isMember) {
      navigate(`/groups/${groupId}`, { replace: true })
    }
  }, [isMember, groupId, navigate])

  async function handleJoin() {
    setStatus('joining')
    try {
      if (group.openJoin) {
        await updateDoc(doc(db, 'groups', groupId), {
          memberIds: arrayUnion(currentUser.uid),
        })
        await setDoc(doc(db, 'groups', groupId, 'members', currentUser.uid), {
          uid: currentUser.uid,
          name: profile?.name || 'Member',
          role: 'member',
          joinedAt: serverTimestamp(),
        })
        navigate(`/groups/${groupId}`, { replace: true })
      } else {
        await setDoc(doc(db, 'groups', groupId, 'joinRequests', currentUser.uid), {
          uid: currentUser.uid,
          name: profile?.name || 'Member',
          requestedAt: serverTimestamp(),
        })
        setStatus('requested')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading invite…</div>
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-3">🔗</div>
        <h1 className="font-semibold text-gray-800 mb-1">This invite link is invalid</h1>
        <p className="text-gray-500 text-sm mb-6">The group may have been deleted.</p>
        <Link to="/groups" className="btn-primary">Go to your groups</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-brand-50 to-white">
      <div className="text-5xl mb-3">🎉</div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">You're invited to</h1>
      <p className="text-2xl font-bold text-brand-600 mb-6">{group.name}</p>

      {(status === 'requested' || alreadyRequested) ? (
        <div className="card p-5 max-w-sm">
          <p className="text-gray-600">
            Your request to join has been sent. An admin needs to approve you before you can see
            the group.
          </p>
          <Link to="/groups" className="btn-secondary w-full mt-4 inline-block">
            Back to your groups
          </Link>
        </div>
      ) : (
        <button onClick={handleJoin} disabled={status === 'joining'} className="btn-primary px-8">
          {status === 'joining'
            ? 'Joining…'
            : group.openJoin
            ? 'Join group'
            : 'Request to join'}
        </button>
      )}

      {status === 'error' && <p className="text-red-500 text-sm mt-3">Something went wrong. Try again.</p>}
    </div>
  )
}

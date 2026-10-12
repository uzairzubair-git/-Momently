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
    return <div className="min-h-screen flex items-center justify-center bg-ink-900 text-ink-300">Loading invite…</div>
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink-900">
        <div className="text-4xl mb-3">🔗</div>
        <h1 className="font-display text-xl font-semibold text-white mb-1">This invite link is invalid</h1>
        <p className="text-ink-300 text-sm mb-6">The group may have been deleted.</p>
        <Link to="/groups" className="btn-primary">Go to your groups</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-ticket overflow-hidden">
        <div className="bg-marigold-100 py-8 flex flex-col items-center">
          <span className="text-5xl mb-2">🎉</span>
          <p className="font-display italic text-ink-600 text-sm">You're invited to</p>
        </div>
        <div className="border-t border-dashed border-ink-200 px-6 py-6">
          <p className="font-display text-2xl font-semibold text-ink-900 mb-6">{group.name}</p>

          {(status === 'requested' || alreadyRequested) ? (
            <>
              <p className="text-ink-500 text-sm mb-4">
                Your request to join has been sent. An admin needs to approve you before you can
                see the group.
              </p>
              <Link to="/groups" className="btn-secondary w-full inline-block">
                Back to your groups
              </Link>
            </>
          ) : (
            <button onClick={handleJoin} disabled={status === 'joining'} className="btn-primary w-full">
              {status === 'joining'
                ? 'Joining…'
                : group.openJoin
                ? 'Join group'
                : 'Request to join'}
            </button>
          )}

          {status === 'error' && <p className="text-cherry-600 text-sm mt-3">Something went wrong. Try again.</p>}
        </div>
      </div>
    </div>
  )
}

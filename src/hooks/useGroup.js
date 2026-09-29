import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// Subscribes to a group document in real time and tells us whether the
// current user is a member/admin of it.
export function useGroup(groupId, currentUserId) {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!groupId) return
    const unsub = onSnapshot(
      doc(db, 'groups', groupId),
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true)
          setGroup(null)
        } else {
          setGroup({ id: snap.id, ...snap.data() })
        }
        setLoading(false)
      },
      () => {
        setNotFound(true)
        setLoading(false)
      }
    )
    return unsub
  }, [groupId])

  const isMember = !!group?.memberIds?.includes(currentUserId)
  const isAdmin = !!group?.adminIds?.includes(currentUserId)

  return { group, loading, notFound, isMember, isAdmin }
}

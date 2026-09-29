import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import Modal from '../common/Modal'
import Avatar from '../common/Avatar'

export default function AdminPanel({ group, onClose }) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [requests, setRequests] = useState([])
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'groups', group.id, 'members'), (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    const unsub2 = onSnapshot(collection(db, 'groups', group.id, 'joinRequests'), (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => {
      unsub1()
      unsub2()
    }
  }, [group.id])

  async function toggleOpenJoin() {
    await updateDoc(doc(db, 'groups', group.id), { openJoin: !group.openJoin })
  }

  async function promote(uid) {
    await updateDoc(doc(db, 'groups', group.id), { adminIds: arrayUnion(uid) })
    await updateDoc(doc(db, 'groups', group.id, 'members', uid), { role: 'admin' })
  }

  async function removeMember(uid) {
    if (!confirm('Remove this member from the group?')) return
    await updateDoc(doc(db, 'groups', group.id), {
      memberIds: arrayRemove(uid),
      adminIds: arrayRemove(uid),
    })
    await deleteDoc(doc(db, 'groups', group.id, 'members', uid))
  }

  async function approveRequest(req) {
    const batch = writeBatch(db)
    batch.update(doc(db, 'groups', group.id), { memberIds: arrayUnion(req.uid) })
    batch.set(doc(db, 'groups', group.id, 'members', req.uid), {
      uid: req.uid,
      name: req.name,
      role: 'member',
      joinedAt: serverTimestamp(),
    })
    batch.delete(doc(db, 'groups', group.id, 'joinRequests', req.uid))
    await batch.commit()
  }

  async function denyRequest(req) {
    await deleteDoc(doc(db, 'groups', group.id, 'joinRequests', req.uid))
  }

  async function handleDeleteGroup() {
    // Note: this deletes the group document itself. For a production app you'd
    // also want a Cloud Function to clean up the messages/media subcollections
    // and the uploaded files in Storage — see README for details.
    await deleteDoc(doc(db, 'groups', group.id))
    navigate('/groups', { replace: true })
  }

  return (
    <Modal open onClose={onClose} title="Group settings">
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Invite settings</h3>
          <div className="flex items-center justify-between card p-3">
            <div>
              <p className="font-medium text-gray-800">Open join</p>
              <p className="text-xs text-gray-400">Anyone with the link can join instantly</p>
            </div>
            <button
              onClick={toggleOpenJoin}
              className={`w-12 h-7 rounded-full transition relative ${group.openJoin ? 'bg-brand-500' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${group.openJoin ? 'left-6' : 'left-1'}`}
              />
            </button>
          </div>
        </section>

        {requests.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Join requests</h3>
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center gap-2 card p-3">
                  <Avatar name={r.name} size={32} />
                  <span className="flex-1 text-sm font-medium text-gray-800">{r.name}</span>
                  <button onClick={() => approveRequest(r)} className="text-xs text-green-600 font-semibold">
                    Approve
                  </button>
                  <button onClick={() => denyRequest(r)} className="text-xs text-gray-400 font-semibold">
                    Deny
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Members ({members.length})</h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 card p-3">
                <Avatar name={m.name} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                  {m.role === 'admin' && <p className="text-xs text-brand-500">Admin</p>}
                </div>
                {m.uid !== currentUser.uid && (
                  <div className="flex items-center gap-2">
                    {m.role !== 'admin' && (
                      <button onClick={() => promote(m.uid)} className="text-xs text-brand-600 font-semibold">
                        Make admin
                      </button>
                    )}
                    <button onClick={() => removeMember(m.uid)} className="text-xs text-red-500 font-semibold">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-100 pt-4">
          {!confirmingDelete ? (
            <button onClick={() => setConfirmingDelete(true)} className="text-red-500 text-sm font-semibold">
              Delete this group
            </button>
          ) : (
            <div className="card p-3 border-red-200">
              <p className="text-sm text-gray-700 mb-3">
                This permanently deletes <strong>{group.name}</strong> for everyone. This can't be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={handleDeleteGroup} className="btn-primary bg-red-500 flex-1">
                  Yes, delete group
                </button>
                <button onClick={() => setConfirmingDelete(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}

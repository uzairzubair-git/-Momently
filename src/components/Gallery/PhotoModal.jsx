import { doc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../common/Avatar'

export default function PhotoModal({ item, groupId, isAdmin, onClose }) {
  const { currentUser } = useAuth()
  if (!item) return null

  const liked = !!item.reactions?.[currentUser.uid]
  const likeCount = Object.keys(item.reactions || {}).length

  async function toggleLike() {
    const mediaRef = doc(db, 'groups', groupId, 'media', item.id)
    await updateDoc(mediaRef, {
      [`reactions.${currentUser.uid}`]: liked ? deleteField() : '❤️',
    })
  }

  async function handleDownload() {
    // Downloads the original, full-quality file (no re-encoding/compression).
    const res = await fetch(item.url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = item.fileName || `eventshare-${item.id}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  }

  async function handleDelete() {
    if (!confirm('Delete this for everyone in the group?')) return
    try {
      if (item.storagePath) {
        await deleteObject(ref(storage, item.storagePath)).catch(() => {})
      }
      await deleteDoc(doc(db, 'groups', groupId, 'media', item.id))
      onClose()
    } catch (err) {
      alert('Could not delete. Please try again.')
    }
  }

  const canDelete = isAdmin || item.uploaderId === currentUser.uid

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <button onClick={onClose} className="text-2xl">×</button>
        <div className="flex items-center gap-2">
          <Avatar name={item.uploaderName} size={26} />
          <span className="text-sm">{item.uploaderName}</span>
        </div>
        {canDelete ? (
          <button onClick={handleDelete} className="text-sm text-red-400">Delete</button>
        ) : (
          <span className="w-10" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {item.type === 'video' ? (
          <video src={item.url} controls autoPlay className="max-h-full max-w-full" />
        ) : (
          <img src={item.url} alt="" className="max-h-full max-w-full object-contain" />
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={toggleLike} className="flex items-center gap-2 text-white">
          <span className="text-2xl">{liked ? '❤️' : '🤍'}</span>
          <span className="text-sm">{likeCount}</span>
        </button>
        <button onClick={handleDownload} className="btn-primary">
          Download original
        </button>
      </div>
    </div>
  )
}

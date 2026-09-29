import { doc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../common/Avatar'

export default function MessageBubble({ message, groupId, isAdmin }) {
  const { currentUser } = useAuth()
  const isMine = message.senderId === currentUser.uid
  const liked = !!message.reactions?.[currentUser.uid]
  const likeCount = Object.keys(message.reactions || {}).length

  async function toggleLike() {
    const msgRef = doc(db, 'groups', groupId, 'messages', message.id)
    await updateDoc(msgRef, {
      [`reactions.${currentUser.uid}`]: liked ? deleteField() : '❤️',
    })
  }

  async function handleDelete() {
    if (!confirm('Delete this message?')) return
    await deleteDoc(doc(db, 'groups', groupId, 'messages', message.id))
  }

  const canDelete = isAdmin || isMine

  return (
    <div className={`flex gap-2 mb-3 ${isMine ? 'flex-row-reverse' : ''}`}>
      {!isMine && <Avatar name={message.senderName} size={30} />}

      <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isMine && <span className="text-xs text-gray-400 mb-0.5 px-1">{message.senderName}</span>}

        <div
          className={`group relative rounded-2xl px-4 py-2 ${
            isMine ? 'bg-brand-500 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
          }`}
        >
          {message.type === 'sticker' ? (
            <span className="text-4xl leading-none">{message.stickerEmoji}</span>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
          <button onClick={toggleLike} className="text-xs flex items-center gap-0.5 text-gray-400">
            <span>{liked ? '❤️' : '🤍'}</span>
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          {canDelete && (
            <button onClick={handleDelete} className="text-xs text-gray-300">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import MessageBubble from './MessageBubble'
import EmojiPicker from './EmojiPicker'
import GifPicker from './GifPicker'

export default function ChatWindow({ groupId, isAdmin }) {
  const { currentUser, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showStickers, setShowStickers] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const q = query(
      collection(db, 'groups', groupId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(200)
    )
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function sendMessage(e) {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    await addDoc(collection(db, 'groups', groupId, 'messages'), {
      type: 'text',
      text: trimmed,
      senderId: currentUser.uid,
      senderName: profile?.name || 'Member',
      reactions: {},
      createdAt: serverTimestamp(),
    })
  }

  async function sendSticker(sticker) {
    await addDoc(collection(db, 'groups', groupId, 'messages'), {
      type: 'sticker',
      stickerEmoji: sticker.emoji,
      senderId: currentUser.uid,
      senderName: profile?.name || 'Member',
      reactions: {},
      createdAt: serverTimestamp(),
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No messages yet. Say hi to the group! 👋
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} groupId={groupId} isAdmin={isAdmin} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="relative border-t border-gray-100 bg-white px-3 py-2 flex items-center gap-2">
        {showEmoji && (
          <EmojiPicker onSelect={(e) => setText((t) => t + e)} onClose={() => setShowEmoji(false)} />
        )}
        {showStickers && (
          <GifPicker onSelect={sendSticker} onClose={() => setShowStickers(false)} />
        )}

        <button
          type="button"
          onClick={() => {
            setShowEmoji((s) => !s)
            setShowStickers(false)
          }}
          className="text-2xl px-1"
        >
          😊
        </button>
        <button
          type="button"
          onClick={() => {
            setShowStickers((s) => !s)
            setShowEmoji(false)
          }}
          className="text-2xl px-1"
        >
          🎊
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message the group…"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />

        <button type="submit" disabled={!text.trim()} className="text-brand-500 font-semibold px-2 disabled:opacity-30">
          Send
        </button>
      </form>
    </div>
  )
}

import { useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function UploadButton({ groupId }) {
  const { currentUser, profile } = useAuth()
  const inputRef = useRef()
  const [progress, setProgress] = useState(null) // 0-100 while uploading, null when idle

  function handlePick() {
    inputRef.current?.click()
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    files.forEach(uploadFile)
    e.target.value = '' // allow picking the same file again later
  }

  function uploadFile(file) {
    const isVideo = file.type.startsWith('video')
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const path = `groups/${groupId}/media/${Date.now()}-${currentUser.uid}-${safeName}`
    const storageRef = ref(storage, path)

    // uploadBytesResumable uploads the original file as-is (no compression),
    // so downloads later are full quality.
    const task = uploadBytesResumable(storageRef, file)
    setProgress(0)

    task.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => {
        setProgress(null)
        alert('Upload failed. Please check your connection and try again.')
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        await addDoc(collection(db, 'groups', groupId, 'media'), {
          url,
          storagePath: path,
          fileName: file.name,
          type: isVideo ? 'video' : 'image',
          uploaderId: currentUser.uid,
          uploaderName: profile?.name || 'Member',
          reactions: {},
          createdAt: serverTimestamp(),
        })
        setProgress(null)
      }
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <button
        onClick={handlePick}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-brand-500 text-white text-2xl flex items-center justify-center shadow-lg active:scale-95 transition"
      >
        {progress !== null ? `${progress}%` : '📷'}
      </button>
    </>
  )
}

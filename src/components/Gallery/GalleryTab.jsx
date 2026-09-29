import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import GalleryGrid from './GalleryGrid'
import PhotoModal from './PhotoModal'
import UploadButton from './UploadButton'

export default function GalleryTab({ groupId, isAdmin }) {
  const [media, setMedia] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'groups', groupId, 'media'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setMedia(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [groupId])

  // Keep the open modal in sync with live updates (e.g. reaction counts).
  useEffect(() => {
    if (!selected) return
    const fresh = media.find((m) => m.id === selected.id)
    if (fresh) setSelected(fresh)
    else setSelected(null) // it was deleted
  }, [media]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pb-28 pt-2 h-full overflow-y-auto no-scrollbar">
      <GalleryGrid media={media} onSelect={setSelected} />
      <UploadButton groupId={groupId} />
      {selected && (
        <PhotoModal item={selected} groupId={groupId} isAdmin={isAdmin} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

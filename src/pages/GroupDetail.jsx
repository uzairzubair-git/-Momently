import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroup } from "../hooks/useGroup";
import BottomTabs from "../components/common/BottomTabs";
import GalleryTab from "../components/Gallery/GalleryTab";
import ChatWindow from "../components/Chat/ChatWindow";
import AdminPanel from "../components/Admin/AdminPanel";

export default function GroupDetail() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { group, loading, notFound, isMember, isAdmin } = useGroup(
    groupId,
    currentUser.uid,
  );

  const [tab, setTab] = useState("gallery");
  const [showAdmin, setShowAdmin] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyInvite() {
    const link = `${window.location.origin}/join/${groupId}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      prompt("Copy this invite link:", link);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-400 bg-paper">
        Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-paper">
        <p className="text-ink-500 mb-4">This group no longer exists.</p>
        <Link to="/groups" className="btn-primary">
          Back to groups
        </Link>
      </div>
    );
  }

  if (!isMember) {
    // Not (yet) a member of this group — send them through the join flow.
    navigate(`/join/${groupId}`, { replace: true });
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-paper">
      {/* Dark event-signage style header */}
      <header className="flex items-center gap-2 px-4 py-4 bg-ink-900 shrink-0">
        <Link to="/groups" className="text-ink-300 text-xl px-1">
          ‹
        </Link>
        <h1 className="flex-1 font-display font-semibold text-white truncate text-lg">
          {group.name}
        </h1>
        <button
          onClick={copyInvite}
          className="text-xs font-semibold text-ink-900 bg-marigold-500 rounded-full px-3 py-1.5 active:scale-95 transition"
        >
          {copied ? "Copied!" : "Invite"}
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowAdmin(true)}
            className="text-lg px-1.5 text-ink-300"
            aria-label="Group settings"
          >
            ⚙️
          </button>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        {tab === "gallery" ? (
          <GalleryTab groupId={groupId} isAdmin={isAdmin} />
        ) : (
          <ChatWindow groupId={groupId} isAdmin={isAdmin} />
        )}
      </main>

      <BottomTabs active={tab} onChange={setTab} />

      {showAdmin && (
        <AdminPanel group={group} onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

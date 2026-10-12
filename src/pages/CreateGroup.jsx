import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function CreateGroup() {
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      const groupRef = await addDoc(collection(db, "groups"), {
        name: name.trim(),
        creatorId: currentUser.uid,
        adminIds: [currentUser.uid],
        memberIds: [currentUser.uid],
        openJoin: true,
        createdAt: serverTimestamp(),
      });

      // Add the creator to the members subcollection too, so we have
      // per-member info (name, role, joinedAt) without extra lookups.
      await setDoc(doc(db, "groups", groupRef.id, "members", currentUser.uid), {
        uid: currentUser.uid,
        name: profile?.name || "Member",
        role: "admin",
        joinedAt: serverTimestamp(),
      });

      navigate(`/groups/${groupRef.id}`);
    } catch (err) {
      setError("Something went wrong creating the group. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper px-5 pt-6 pb-10">
      <Link to="/groups" className="text-ink-400 text-sm">
        ‹ Back
      </Link>

      <div className="text-center mt-6 mb-8">
        <p className="font-display italic text-ink-400 text-sm mb-1">
          start a new
        </p>
        <h1 className="font-display font-semibold text-3xl text-ink-900">
          Event
        </h1>
      </div>

      <div className="ticket-card max-w-sm mx-auto">
        <form onSubmit={handleSubmit} className="p-6 pb-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-500">
              Group name
            </label>
            <input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mt-1"
              placeholder="Ali's Birthday Party"
            />
          </div>
          <p className="text-xs text-ink-400">
            You'll automatically become the admin. You can invite people with a
            link once the group is created.
          </p>
          {error && <p className="text-sm text-cherry-600">{error}</p>}
        </form>

        <div className="flex items-center gap-3 px-6">
          <div className="flex-1 border-t border-dashed border-ink-200" />
          <span className="text-[11px] text-ink-300">admit one</span>
          <div className="flex-1 border-t border-dashed border-ink-200" />
        </div>

        <div className="p-6 pt-5">
          <button
            onClick={handleSubmit}
            disabled={busy}
            className="btn-primary w-full"
          >
            {busy ? "Creating…" : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}

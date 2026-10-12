import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";

export default function GroupList() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "groups"),
      where("memberIds", "array-contains", currentUser.uid),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setGroups(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [currentUser.uid]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-paper pb-28">
      <header className="bg-paper px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar name={profile?.name} size={42} />
          <div>
            <p className="text-xs text-ink-400">Welcome back</p>
            <p className="font-semibold text-ink-900">{profile?.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-ink-400 font-medium"
        >
          Log out
        </button>
      </header>

      <main className="px-5 pt-3">
        <h1 className="font-display font-semibold text-2xl text-ink-900 mb-5">
          Your tickets
        </h1>

        {loading && <p className="text-ink-400 text-sm">Loading…</p>}

        {!loading && groups.length === 0 && (
          <div className="card p-6 text-center mt-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-ink-500 mb-4">
              You're not part of any groups yet. Create one, or ask a friend for
              an invite link!
            </p>
          </div>
        )}

        <div className="space-y-5">
          {groups.map((g, i) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              className={`ticket-card flex items-stretch hover:shadow-lg transition ${
                i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]"
              } hover:rotate-0`}
            >
              {/* Stub: member count, like a seat number */}
              <div className="w-20 shrink-0 flex flex-col items-center justify-center py-5 border-r-2 border-dashed border-ink-100">
                <span className="font-display font-semibold text-2xl text-dusk-500 leading-none">
                  {g.memberIds?.length || 1}
                </span>
                <span className="text-[10px] text-ink-300 mt-1 tracking-wide">
                  {g.memberIds?.length === 1 ? "member" : "members"}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-lg text-ink-900 truncate">
                    {g.name}
                  </p>
                  {g.adminIds?.includes(currentUser.uid) && (
                    <p className="text-xs text-marigold-600 font-medium mt-0.5">
                      You're the admin
                    </p>
                  )}
                </div>
                <span className="text-ink-200 text-xl">›</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Link
        to="/groups/new"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-marigold-500 text-ink-900 text-3xl flex items-center justify-center shadow-floatnav active:scale-95 transition"
      >
        +
      </Link>
    </div>
  );
}

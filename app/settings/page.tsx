"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, UserPlus, ShieldAlert, Users, Save, User as UserIcon, DollarSign } from "lucide-react";

interface AdminUser {
  _id: string;
  email: string;
  username?: string;
  createdAt?: string;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  // --- STATES ---
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [adminList, setAdminList] = useState<AdminUser[]>([]);

  // --- USERNAME & CURRENCY STATES ---
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("USD"); 
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // --- FETCH DATA ---
  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) setAdminList(await res.json());
    } catch (error) { console.error("Failed to load admins"); }
  };

  const fetchSettings = async () => {
    try {
      // 👇 ADDED: { cache: "no-store" } to stop browser from remembering "USD"
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.username) setUsername(data.username);
        if (data.currency) setCurrency(data.currency);
      }
    } catch (error) { console.error("Failed to load settings"); }
  };

  // 👇 ADDED: Sync with session immediately. 
  // If session says INR, set INR instantly.
  useEffect(() => {
    if (session?.user) {
      // @ts-ignore
      if (session.user.currency) setCurrency(session.user.currency);
      // @ts-ignore
      if (session.user.username && !username) setUsername(session.user.username);
    }
  }, [session]);

  useEffect(() => {
    fetchAdmins();
    fetchSettings(); 
  }, []);

  // --- HANDLERS ---
  const handleRemoveAdmin = async (id: string) => {
    if (!confirm("Are you sure? They will lose access immediately.")) return;
    const res = await fetch("/api/users", { method: "DELETE", body: JSON.stringify({ id }) });
    if (res.ok) fetchAdmins();
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", { method: "POST", body: JSON.stringify(formData) });
    if (res.ok) {
      setMessage("✅ New Admin Added!");
      setFormData({ email: "", password: "" });
      fetchAdmins();
    } else {
      setMessage("❌ Error: Email might exist.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg("");

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, currency }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setFeedbackMsg("✅ Settings updated!");
      // Updates the session so the change is instant everywhere
      await update({ username, currency });
      fetchAdmins(); 
    } else {
      setFeedbackMsg(`❌ ${data.error}`);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* 1. Combined Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-purple-700">
              <UserIcon size={24} />
              <h2 className="text-xl font-bold">Admin Profile</h2>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Ted"
                  className="w-full border p-2 rounded text-black font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border p-2 pl-10 rounded text-black font-medium bg-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol}) - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {feedbackMsg && <div className="text-sm font-medium">{feedbackMsg}</div>}
              
              <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition-colors flex justify-center items-center gap-2">
                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* 2. Add Admin */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
              <UserPlus size={24} />
              <h2 className="text-xl font-bold">Onboard New Admin</h2>
            </div>
            {message && <div className="p-3 mb-4 bg-gray-100 rounded text-sm font-medium">{message}</div>}
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <input type="email" placeholder="New Admin Email" className="w-full border p-2 rounded text-black" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input type="password" placeholder="New Password" className="w-full border p-2 rounded text-black" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Create Account</button>
            </form>
          </div>

          {/* 3. Signout Zone */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <ShieldAlert size={24} />
              <h2 className="text-xl font-bold">Signout</h2>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded font-bold hover:bg-red-600 hover:text-white transition-all">
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Admin List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
          <div className="flex items-center gap-2 mb-6 text-gray-700">
            <Users size={24} />
            <h2 className="text-xl font-bold">Authorized Admins</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Name</th> 
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminList.map((user) => {
                  const isCurrentUser = session?.user?.email === user.email;
                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user.username ? user.username : <span className="text-gray-400 italic">Unknown</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.email} {isCurrentUser && <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">(You)</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!isCurrentUser && (
                          <button onClick={() => handleRemoveAdmin(user._id)} className="text-red-500 hover:text-red-700 underline text-xs font-bold">Remove</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
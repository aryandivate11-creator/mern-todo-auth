import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile");
      const data = await res.json();
      setProfile(data);
      setForm({ name: data.name || "", phone: data.phone || "" });
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const initial = profile.name ? profile.name[0].toUpperCase() : "?";

  // ---------- VALIDATION ----------
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">

        {/* Avatar */}
        <div className="flex justify-center mb-4 relative">
          {profile.profilePic ? (
            <img
              src={`https://mernbackend-aruu.duckdns.org${profile.profilePic}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {initial}
            </div>
          )}

          {/* Upload */}
          <label className="absolute bottom-1 right-[40%] bg-white p-2 rounded-full shadow cursor-pointer">
            ✏️
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={async (e) => {
                const fd = new FormData();
                fd.append("photo", e.target.files[0]);

                await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile/upload-photo", {
                  method: "POST",
                  body: fd
                });

                fetchProfile();
              }}
            />
          </label>
        </div>

        {/* Fields */}
        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Name"
          disabled={!editing}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Phone"
          disabled={!editing}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded bg-gray-100"
          disabled
          value={profile.email}
        />

        {/* Buttons */}
        <div className="flex justify-between mt-4">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit ✏️
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!form.name.trim()) {
                  alert("Name required");
                  return;
                }

                if (form.phone && !isValidPhone(form.phone)) {
                  alert("Invalid phone number");
                  return;
                }

                await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile", {
                  method: "PUT",
                  body: JSON.stringify(form)
                });

                setEditing(false);
                fetchProfile();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save 💾
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Back to Todos
          </button>

        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;

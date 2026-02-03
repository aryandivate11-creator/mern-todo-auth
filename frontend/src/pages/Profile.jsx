import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const fetchProfile = async () => {
    const res = await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile");
    const data = await res.json();

    setProfile(data);
    setName(data.name || "");
    setPhone(data.phone || "");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  const initial = profile.name ? profile.name[0].toUpperCase() : "?";

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
        </div>

        {/* Editable Fields */}
        <div className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
          />

          <input
            className="w-full border p-2 rounded bg-gray-100"
            value={profile.email}
            disabled
          />

        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-between">

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
                await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile", {
                  method: "PUT",
                  body: JSON.stringify({ name, phone })
                });
                setEditing(false);
                fetchProfile();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save 💾
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;

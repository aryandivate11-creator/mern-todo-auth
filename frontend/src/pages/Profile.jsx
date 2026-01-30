import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";
import { GoogleLogin } from "@react-oauth/google";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile");
      const data = await res.json();

      setProfile(data);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile", {
        method: "PUT",
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      setProfile(data);
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-3">

        <h2 className="text-2xl font-bold mb-2">Profile</h2>

        {/* Editable name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Editable phone */}
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <p className="text-sm text-gray-600">
          Email: <b>{profile.email}</b>
        </p>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <div className="mt-5 border-t pt-4">

          {profile.sheetConnected ? (
            <>
              <p className="text-green-600 font-semibold">
                Spreadsheet connected ✅
              </p>

              <a
                href={`https://docs.google.com/spreadsheets/d/${profile.sheetId}`}
                target="_blank"
                className="text-blue-600 underline block mt-2"
              >
                Open Sheet
              </a>

              <p className="text-sm text-gray-500 mt-1">
                You can reconnect anytime
              </p>
            </>
          ) : (
            <p className="text-red-600 font-semibold">
              No spreadsheet connected ❌
            </p>
          )}

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={async (res) => {
                await apiFetch(
                  "https://mernbackend-aruu.duckdns.org/api/profile/connect-sheet",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken: res.access_token }),
                  }
                );

                fetchProfile();
              }}
              onError={() => alert("Google authorization failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

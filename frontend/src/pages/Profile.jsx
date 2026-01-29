import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";
import { GoogleLogin } from "@react-oauth/google";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile");
      const data = await res.json();
      setProfile(data);
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
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <p><b>Name:</b> {profile.data.name || "Not set"}</p>
        <p><b>Email:</b> {profile.data.email}</p>
        <p><b>Phone:</b> {profile.data.phone || "Not set"}</p>

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
                await apiFetch("https://mernbackend-aruu.duckdns.org/api/profile/connect-sheet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken: res.access_token }),
                });

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

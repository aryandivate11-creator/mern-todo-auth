export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + accessToken,
  };

  // ❗ Only set JSON header if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshRes = await fetch(
      "https://mernbackend-aruu.duckdns.org/api/auth/refresh", // fixed typo too
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const refreshData = await refreshRes.json();

    if (refreshRes.ok) {
      localStorage.setItem("accessToken", refreshData.accessToken);
      return apiFetch(url, options);
    } else {
      localStorage.clear();
      window.location.reload();
    }
  }

  return res;
};

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshRes = await fetch("http://13.53.207.171:3000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshData = await refreshRes.json();

    if (refreshRes.ok) {
      localStorage.setItem("accessToken", refreshData.accessToken);

      // Retry original request
      return apiFetch(url, options);
    } else {
      // Refresh failed → force logout
      localStorage.clear();
      window.location.reload();
    }
  }

  return res;
};

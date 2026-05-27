export const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi giải mã Token:", e);
    return null;
  }
};

export const isAdmin = () => {
  const data = getAuthData();
  return data?.role === "ADMIN";
};

export const isLoggedIn = () => {
  return typeof window !== "undefined" && !!localStorage.getItem("token");
};

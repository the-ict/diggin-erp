const BASE_URL = "http://localhost:3000/api";

export const userRequests = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  register: async (username: string, password: string, role: string, teamId?: string) => {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role, teamId }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  getCurrentUser: async (token: string) => {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get user");
    return res.json();
  },
};

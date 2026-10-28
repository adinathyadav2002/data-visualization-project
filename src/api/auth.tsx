import axios from "axios";
import Cookie from "js-cookie";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}api/auth/login`,
      {
        email,
        password,
      }
    );

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    if (response.data.user) {
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getCurrentUserProfile = async (token?: string) => {
  try {
    const authToken = token || Cookie.get("access_token");
    const headers: Record<string, string> = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}api/users/profile`,
      { headers }
    );

    if (response.data && response.data.user) {
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const logoutUser = async () => {
  // remove access token from cookies and user_info from storage
  Cookie.remove("access_token");
  localStorage.removeItem("user_info");
};

export const verifyUserByToken = async (token: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}api/auth/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Verification failed");
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    // remove access token from cookies if verification fails
    Cookie.remove("access_token");
    throw error;
  }
};

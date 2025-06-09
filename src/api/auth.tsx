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

    return response.data.token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  // remove access token from cookies
  Cookie.remove("access_token");
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

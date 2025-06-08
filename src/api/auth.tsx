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

  // redirect to home page
  window.location.href = "/";
};

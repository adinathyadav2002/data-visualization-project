import axios from "axios";

// {
//     "first_name": "string",
//     "last_name": "string",
//     "email": "string",
//     "password": "string"
//   }

export const registerUser = async (formdata) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}api/users`,
      {
        first_name: formdata.firstName,
        last_name: formdata.lastName,
        email: formdata.email,
        password: formdata.password,
      }
    );

    if (response.status !== 201) {
      throw new Error("Registration failed");
    }

    // API returns a token upon successful registration
    return response.data.token;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

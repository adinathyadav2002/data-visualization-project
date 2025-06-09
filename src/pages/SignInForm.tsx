import { EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "@/api/auth";
import Cookie from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/user";

export default function SigninForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userData, isAuthenticated, login } = useUserContext();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to analysis page
    if (isAuthenticated) {
      navigate("/analysis");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await loginUser(formData.username, formData.password);
      if (formData.rememberMe) {
        // Store token in cookies with expiration
        Cookie.set("access_token", token, { expires: 7 }); // Store for 7 days
      } else {
        // Store token in session cookies (expires when browser closes)
        Cookie.set("access_token", token); // Session cookie
      }

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "success",
      });

      login();
      navigate("/analysis");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials.",
        variant: "destructive",
      });
      console.error("Login failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center md:pt-6">
      <div className="py-6 px-4 w-full">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full mx-auto">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto bg-white">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-12">
                  <h1 className="text-slate-900 text-3xl font-semibold">
                    Sign in
                  </h1>
                  <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                    Sign in to your account and explore a world of
                    possibilities. Your journey begins here.
                  </p>
                </div>

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    User name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 focus:border-blue-600"
                      placeholder="Enter user name"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4 pointer-events-none"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="10" cy="7" r="6"></circle>
                      <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"></path>
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 focus:border-blue-600"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 p-1 rounded"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#bbb"
                          className="w-[18px] h-[18px] cursor-pointer hover:fill-slate-600 transition-colors"
                          viewBox="0 0 128 128"
                        >
                          <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"></path>
                        </svg>
                      ) : (
                        <EyeOff className="text-slate-300 w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded accent-blue-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm text-slate-900 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium focus:outline-none focus:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div className="!mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign in
                  </button>
                  <p className="text-sm !mt-6 text-center text-slate-600">
                    Don't have an account{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap focus:outline-none focus:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="max-lg:mt-8">
            <img
              src="/login-image.webp"
              className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover rounded-lg"
              alt="Login illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

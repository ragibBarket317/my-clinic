import axios from "axios";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Field from "./common/Field";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterFrom = () => {
  const [showPass, setShowPass] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tokenAccess = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        const response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/invite/verifyToken/${token}`
        );
        
        setAccessToken(response?.data?.data);
      } catch (err) {
        setError(err);
      }
    };

    tokenAccess();
  }, [location]);

  const updatePasswordChecks = () => {
    setPasswordChecks({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
    });
  };

  const validatePassword = () => {
    if (password.length < 6) {
      return "Your password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Your password must contain at least one uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Your password must contain at least one digit";
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return "Your password must contain at least one special character";
    }
    return null;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const passwordError = validatePassword();
      if (passwordError) {
        toast.error(passwordError);
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/register`,
        {
          fullName: `${firstName} ${lastName}`,
          email: accessToken?.email,
          password,
          role: accessToken?.role,
        }
      );

      if (response.status === 200) {
        navigate("/login");
        toast.success("Registration successful!");
      }
    } catch (error) {
      console.error(error);
      // setError("Error is : ", error);
      toast.error("Something went wrong!");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePasswordChecks();
  }, [password]);

  return (
    <>
      <p className="text-[14px] mb-4">
        You are invited to register as an {accessToken?.role}
      </p>
      <form
        className="pb-8 lg:pb-[10px] space-y-2 text-[20px] w-[558px]"
        onSubmit={submitForm}
      >
        <p>
          <label htmlFor="firstName" className="mb-2 block">
            First Name
          </label>
          <input
            className="auth-input border-[#7C7C7C] px-[20px] h-[60px] text-[18px] rounded-[10px]"
            type="text"
            name="firstName"
            id="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            placeholder="Enter your First Name"
            required
          />
        </p>
        <p>
          <label htmlFor="lastName" className="mb-2 block">
            Last Name
          </label>
          <input
            className="auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]"
            type="text"
            name="lastName"
            id="lastName"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            placeholder="Enter your Last Name"
          />
        </p>
        <p>
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            className="auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]"
            type="email"
            name="email"
            id="email"
            value={accessToken?.email}
            disabled
          />
        </p>
        <p>
          <div className="relative">
            <label htmlFor="password" className="mb-2 block">
              Password
            </label>
            <input
              className="auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]"
              type={showPass ? "text" : "password"}
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your Password"
              required
            />
            <div className="absolute cursor-pointer inset-y-0 top-1/2 right-0 flex items-center mr-2">
              <div className="">
                {!showPass ? (
                  <IoEyeOutline onClick={() => setShowPass(!showPass)} />
                ) : (
                  <FaRegEyeSlash onClick={() => setShowPass(!showPass)} />
                )}
              </div>
            </div>
          </div>
        </p>
        {/* <p className="text-red-500 mb-4">{error}</p> */}
        <div className="text-[14px] space-x-3 mt-2">
          <input type="checkbox" checked={passwordChecks.length} />
          <label htmlFor="characters">6 Characters</label>
          <input type="checkbox" checked={passwordChecks.uppercase} />
          <label htmlFor="uppercase">Uppercase</label>
          <input type="checkbox" checked={passwordChecks.number} />
          <label htmlFor="number">Number</label>
          <input type="checkbox" checked={passwordChecks.specialChar} />
          <label htmlFor="special">Special Character</label>
        </div>
        <Field>
          {loading ? (
            <button disabled className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90 flex justify-center items-center">
              <svg
                className="animate-spin h-6 w-6 mr-3"
                viewBox="0 0 800 800"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="400"
                  cy="400"
                  fill="none"
                  r="200"
                  strokeWidth="80"
                  stroke="#ffffff"
                  strokeDasharray="1008 1400"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-bold text-[20px]">Processing...</span>
            </button>
          ) : (
            <button className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90">
              Sign Up
            </button>
          )}
        </Field>
      </form>
    </>
  );
};

export default RegisterFrom;
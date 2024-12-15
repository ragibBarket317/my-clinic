import axios from "axios";
import { useEffect, useState } from "react";
import { useStore } from "../Store";
import Loader from "./Loader";
const UserContext = ({ children }) => {
  const { auth, setAuth } = useStore();
  const [loading, setLoading] = useState(false);
  async function checkToken() {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/verify-token`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setAuth({ data: response });
      } else {
        setAuth(null);
        // window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      setAuth(null);
      // window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
};

export default UserContext;

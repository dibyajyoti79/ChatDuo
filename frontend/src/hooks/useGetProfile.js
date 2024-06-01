import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const getProfile = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/users/${id}`);
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setUser(data.data);
      return data.data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, user, getProfile };
};
export default useGetProfile;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useSearchUser = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const searchUsers = async (username) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/users/search/${username}`);
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setUsers(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchUsers, users, setUsers };
};
export default useSearchUser;

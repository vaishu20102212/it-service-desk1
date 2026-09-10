import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import type { User } from "../types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};
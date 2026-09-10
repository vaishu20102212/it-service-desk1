import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
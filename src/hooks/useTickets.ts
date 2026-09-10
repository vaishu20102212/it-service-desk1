import { useEffect, useState } from "react";
import { getTickets } from "../services/ticketService";
import type { Ticket } from "../types/ticket";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTickets();
      setTickets(data);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  };
};
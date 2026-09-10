import type { TicketStatus } from "../../types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const TicketStatusBadge = ({
  status,
}: TicketStatusBadgeProps) => {
  const statusStyles: Record<TicketStatus, string> = {
    open: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    pending: "bg-orange-100 text-orange-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    reopened: "bg-indigo-100 text-indigo-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status]
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default TicketStatusBadge;
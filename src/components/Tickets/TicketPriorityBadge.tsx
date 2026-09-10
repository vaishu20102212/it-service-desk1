import type { TicketPriority } from "../../types/ticket";

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

const TicketPriorityBadge = ({
  priority,
}: TicketPriorityBadgeProps) => {
  const priorityStyles: Record<TicketPriority, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        priorityStyles[priority]
      }`}
    >
      {priority}
    </span>
  );
};

export default TicketPriorityBadge;
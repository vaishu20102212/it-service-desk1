import type { Ticket } from "../../types/ticket";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import { formatDate } from "../../utils/formatDate";

interface TicketTableProps {
  tickets: Ticket[];
  onView?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
}

const TicketTable = ({ tickets, onView, onDelete }: TicketTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white border border-gray-100 shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200/70">
          <tr>
            <th className="px-5 py-3.5">Ticket ID</th>
            <th className="px-5 py-3.5">Subject</th>
            <th className="px-5 py-3.5">Category</th>
            <th className="px-5 py-3.5">Priority</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Created Date</th>
            {(onView || onDelete) && <th className="px-5 py-3.5 text-right">Actions</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-700">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50/60 transition">
              <td className="px-5 py-3.5 font-semibold text-blue-600">
                {ticket.id}
              </td>

              <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                {ticket.subject}
              </td>

              <td className="px-5 py-3.5 text-gray-600">
                {ticket.category}
              </td>

              <td className="px-5 py-3.5">
                <TicketPriorityBadge priority={ticket.priority} />
              </td>

              <td className="px-5 py-3.5">
                <TicketStatusBadge status={ticket.status} />
              </td>

              <td className="px-5 py-3.5 text-gray-500 text-xs">
                {formatDate(ticket.createdDate)}
              </td>

              {(onView || onDelete) && (
                <td className="px-5 py-3.5 text-right space-x-2">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(ticket)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      View
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(ticket.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
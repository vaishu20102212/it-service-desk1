import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import type { Ticket } from "../../types/ticket";
import type { User } from "../../types/user";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  agents: User[];
  onAssign: (ticketId: string, agentId: string | null) => Promise<void>;
}

const AssignmentModal = ({
  isOpen,
  onClose,
  ticket,
  agents,
  onAssign,
}: AssignmentModalProps) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setSelectedAgentId(ticket.assignedAgent || "");
    }
  }, [ticket]);

  if (!ticket) return null;

  const currentAgent = agents.find((a) => a.id === ticket.assignedAgent);
  const todayDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAssign(ticket.id, selectedAgentId ? selectedAgentId : null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async () => {
    setSubmitting(true);
    try {
      await onAssign(ticket.id, null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket Assignment: ${ticket.id}`}
    >
      <form onSubmit={handleSave} className="space-y-4 mt-2">
        {/* Ticket Summary */}
        <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold uppercase text-gray-400">
            Ticket Subject
          </span>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">
            {ticket.subject}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Category: {ticket.category}</span>
            <span>Priority: <span className="font-medium capitalize text-gray-700">{ticket.priority}</span></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-blue-50/50 p-2.5 border border-blue-100">
            <span className="font-semibold text-blue-800">Current Agent</span>
            <p className="mt-0.5 font-medium text-gray-800">
              {currentAgent ? `${currentAgent.name} (${currentAgent.id})` : "Unassigned"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
            <span className="font-semibold text-gray-600">Assignment Date</span>
            <p className="mt-0.5 font-medium text-gray-800">{todayDate}</p>
          </div>
        </div>

        {/* Available Support Agents Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Assign To Support Agent
          </label>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="">-- Select Agent --</option>
            {agents
              .filter((a) => a.role === "support_agent" && a.status === "active")
              .map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.email}) - {agent.department}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {ticket.assignedAgent ? (
            <button
              type="button"
              onClick={handleUnassign}
              disabled={submitting}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              Unassign Ticket
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedAgentId}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {submitting
                ? "Saving..."
                : ticket.assignedAgent
                ? "Reassign Ticket"
                : "Assign Ticket"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;

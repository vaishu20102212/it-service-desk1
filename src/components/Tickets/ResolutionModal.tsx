import { useState } from "react";
import Modal from "../common/Modal";
import type { Ticket } from "../../types/ticket";

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onResolve: (ticketId: string, resolution: string, resolutionNotes: string) => Promise<void>;
}

const ResolutionModal = ({
  isOpen,
  onClose,
  ticket,
  onResolve,
}: ResolutionModalProps) => {
  const [resolution, setResolution] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!ticket) return null;

  const todayDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) {
      setError("Resolution summary is required");
      return;
    }
    if (!resolutionNotes.trim()) {
      setError("Resolution notes are required");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onResolve(ticket.id, resolution.trim(), resolutionNotes.trim());
      setResolution("");
      setResolutionNotes("");
      onClose();
    } catch {
      setError("Failed to resolve ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve Ticket: ${ticket.id}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-800">
            Resolving: {ticket.subject}
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Category: {ticket.category} | Created by: {ticket.createdBy}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Resolution Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="e.g. Network adapter was reset and reconnected"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Resolution Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Detailed steps taken to resolve this problem..."
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Resolved Date
          </label>
          <input
            type="text"
            disabled
            value={todayDate}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-600 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
          >
            {submitting ? "Resolving..." : "Confirm Resolution"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResolutionModal;

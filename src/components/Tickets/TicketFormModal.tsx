import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import type { Ticket, TicketPriority, ContactMethod } from "../../types/ticket";
import type { Category } from "../../types/category";

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: {
    subject: string;
    description: string;
    category: string;
    priority: TicketPriority;
    preferredContactMethod: ContactMethod;
  }) => Promise<void>;
  initialTicket?: Ticket | null;
  categories: Category[];
  isEdit?: boolean;
}

const TicketFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTicket,
  categories,
  isEdit = false,
}: TicketFormModalProps) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod>("email");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTicket) {
      setSubject(initialTicket.subject);
      setDescription(initialTicket.description);
      setCategory(initialTicket.category);
      setPriority(initialTicket.priority);
      setPreferredContactMethod(initialTicket.preferredContactMethod || "email");
    } else {
      setSubject("");
      setDescription("");
      setCategory(categories.length > 0 ? categories[0].name : "Software");
      setPriority("medium");
      setPreferredContactMethod("email");
    }
    setErrors({});
  }, [initialTicket, categories, isOpen]);

  // Section 23: Form Validation
  // - Required field validation
  // - Minimum description length (>= 10 chars)
  // - Required category & priority
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim()) {
      errs.subject = "Subject is required";
    } else if (subject.trim().length < 4) {
      errs.subject = "Subject must be at least 4 characters";
    }

    if (!description.trim()) {
      errs.description = "Description is required";
    } else if (description.trim().length < 10) {
      errs.description = "Description must be at least 10 characters";
    }

    if (!category) {
      errs.category = "Category is required";
    }

    if (!priority) {
      errs.priority = "Priority is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        preferredContactMethod,
      });
      onClose();
    } catch {
      setErrors({ form: "Failed to save ticket. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Ticket: ${initialTicket?.id}` : "Create New Support Ticket"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {errors.form && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {errors.form}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition ${
              errors.subject
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Description <span className="text-red-500">*</span> (min 10 characters)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide clear details regarding the problem you are experiencing..."
            className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition ${
              errors.description
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-xs text-red-500">{errors.priority}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Preferred Contact Method <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["email", "phone", "chat"] as ContactMethod[]).map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPreferredContactMethod(method)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold capitalize transition ${
                  preferredContactMethod === method
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {method === "email" && "✉️ Email"}
                {method === "phone" && "📞 Phone"}
                {method === "chat" && "💬 Chat"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? "Saving..." : isEdit ? "Update Ticket" : "Submit Ticket"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TicketFormModal;

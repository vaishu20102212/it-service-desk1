import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import type { Category, CategoryStatus } from "../../types/category";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: {
    name: string;
    description: string;
    status: CategoryStatus;
  }) => Promise<void>;
  initialCategory?: Category | null;
  isEdit?: boolean;
}

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialCategory,
  isEdit = false,
}: CategoryFormModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setDescription(initialCategory.description);
      setStatus(initialCategory.status);
    } else {
      setName("");
      setDescription("");
      setStatus("active");
    }
    setErrors({});
  }, [initialCategory, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Category Name is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!status) errs.status = "Status is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status,
      });
      onClose();
    } catch {
      setErrors({ form: "Failed to save category." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Category: ${initialCategory?.name}` : "Add Ticket Category"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {errors.form && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {errors.form}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cloud Infrastructure"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What support requests belong to this category..."
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
              errors.description ? "border-red-500" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CategoryStatus)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
          >
            {submitting ? "Saving..." : isEdit ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;

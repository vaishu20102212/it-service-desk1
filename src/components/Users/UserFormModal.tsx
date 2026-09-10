import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import type { User, UserRole, UserStatus } from "../../types/user";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    department: string;
    role: UserRole;
    status: UserStatus;
  }) => Promise<void>;
  initialUser?: User | null;
  isEdit?: boolean;
}

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialUser,
  isEdit = false,
}: UserFormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("IT");
  const [role, setRole] = useState<UserRole>("employee");
  const [status, setStatus] = useState<UserStatus>("active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name);
      setEmail(initialUser.email);
      setPassword(initialUser.password || "123456");
      setPhone(initialUser.phone || "");
      setDepartment(initialUser.department);
      setRole(initialUser.role);
      setStatus(initialUser.status);
    } else {
      setName("");
      setEmail("");
      setPassword("123456");
      setPhone("");
      setDepartment("IT");
      setRole("employee");
      setStatus("active");
    }
    setErrors({});
  }, [initialUser, isOpen]);

  // Section 23: Validations
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email format";
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (phoneDigits.length < 10) {
      errs.phone = "Valid phone number requires at least 10 digits";
    }

    if (!department.trim()) errs.department = "Department is required";
    if (!role) errs.role = "Role assignment is required";
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
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        department: department.trim(),
        role,
        status,
      });
      onClose();
    } catch {
      setErrors({ form: "Failed to save user. Please check data." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit User: ${initialUser?.name}` : "Add New User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {errors.form && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {errors.form}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rachel Green"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rachel@gmail.com"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
              Phone (10 digits) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                errors.phone ? "border-red-500" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
              Assign Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm outline-none focus:border-blue-600"
            >
              <option value="employee">Employee</option>
              <option value="support_agent">Support Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
              User Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm outline-none focus:border-blue-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
            {submitting ? "Saving..." : isEdit ? "Update User" : "Save User"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;

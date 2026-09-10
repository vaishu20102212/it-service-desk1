import { useState, useMemo } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useToast } from "../../context/ToastContext";
import UserTable from "../../components/Users/UserTable";
import UserFormModal from "../../components/Users/UserFormModal";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { createUser, updateUser, deleteUser } from "../../services/userService";
import type { User, UserRole, UserStatus } from "../../types/user";

const Users = () => {
  const { users, loading, error, refetch } = useUsers();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (userData: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    department: string;
    role: UserRole;
    status: UserStatus;
  }) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
        showToast(`User ${userData.name} updated successfully`, "success");
      } else {
        const newId = `U${String(users.length + 1).padStart(2, "0")}`;
        await createUser({
          id: newId,
          ...userData,
          password: userData.password || "123456",
          createdDate: new Date().toISOString().split("T")[0],
        });
        showToast(`User ${userData.name} added successfully`, "success");
      }
      refetch();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus: UserStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateUser(user.id, { status: nextStatus });
      showToast(`User status set to ${nextStatus}`, "success");
      refetch();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${userId}?`)) {
      try {
        await deleteUser(userId);
        showToast("User deleted successfully", "success");
        refetch();
      } catch {
        showToast("Failed to delete user", "error");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management (Admin Only)
          </h1>
          <p className="text-sm text-gray-500">
            Create, manage, and assign roles to system employees and support agents
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, department, ID..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-3 text-xs">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-blue-600"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="support_agent">Support Agent</option>
            <option value="employee">Employee</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        {filteredUsers.length === 0 ? (
          <EmptyState message="No users match your criteria." />
        ) : (
          <>
            <UserTable
              users={paginatedUsers}
              onView={(u) => setViewingUser(u)}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteUser}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
            />
          </>
        )}
      </div>

      {/* Add / Edit User Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialUser={editingUser}
        isEdit={Boolean(editingUser)}
        onSubmit={handleFormSubmit}
      />

      {/* View User Details Modal */}
      {viewingUser && (
        <Modal
          isOpen={Boolean(viewingUser)}
          onClose={() => setViewingUser(null)}
          title={`User Profile: ${viewingUser.name}`}
        >
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-xl">
                {viewingUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{viewingUser.name}</h3>
                <p className="text-sm text-gray-500">{viewingUser.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 capitalize">
                    {viewingUser.role.replace("_", " ")}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    viewingUser.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {viewingUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                <span className="text-gray-400 uppercase font-semibold">User ID</span>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{viewingUser.id}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                <span className="text-gray-400 uppercase font-semibold">Department</span>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{viewingUser.department}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                <span className="text-gray-400 uppercase font-semibold">Phone</span>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{viewingUser.phone || "None"}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                <span className="text-gray-400 uppercase font-semibold">Created Date</span>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{viewingUser.createdDate}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;
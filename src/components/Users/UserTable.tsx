import type { User } from "../../types/user";

interface UserTableProps {
  users: User[];
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserTable = ({
  users,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white border border-gray-100 shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200/70">
          <tr>
            <th className="px-5 py-3.5">ID</th>
            <th className="px-5 py-3.5">Name</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Phone</th>
            <th className="px-5 py-3.5">Department</th>
            <th className="px-5 py-3.5">Role</th>
            <th className="px-5 py-3.5">Status</th>
            {(onView || onEdit || onToggleStatus || onDelete) && (
              <th className="px-5 py-3.5 text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/60 transition">
              <td className="px-5 py-3.5 font-semibold text-gray-500">
                {user.id}
              </td>
              <td className="px-5 py-3.5 font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {user.email}
              </td>
              <td className="px-5 py-3.5 text-gray-600 text-xs">
                {user.phone || "-"}
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {user.department}
              </td>
              <td className="px-5 py-3.5 capitalize">
                <span className="inline-block rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                  {user.role.replace("_", " ")}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              {(onView || onEdit || onToggleStatus || onDelete) && (
                <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                  )}
                  {onToggleStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(user.id)}
                      className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition"
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

export default UserTable;